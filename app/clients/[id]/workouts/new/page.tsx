"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { use } from "react";

const WorkoutSchema = z.object({
  date: z.string().min(1, { message: "日付を入力してください" }),
  exercise_name: z.string().min(1, { message: "運動名を入力してください" }),
  sets_reps_weight: z.string().min(1, { message: "セット数、レップ数、重量を入力してください" }),
  notes: z.string().optional(),
});

type WorkoutFormValues = z.infer<typeof WorkoutSchema>;

export default function NewWorkoutPage({ params }: { params: Promise<{ id: string; workoutId: string }> }) {
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(WorkoutSchema),
    defaultValues: {
      date: "",
      exercise_name: "",
      sets_reps_weight: "",
      notes: "",
    },
  });

  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const onSubmit = async (values: WorkoutFormValues) => {
    const { date, exercise_name, sets_reps_weight, notes } = values;

    const { error } = await supabase
      .from("workouts")
      .insert({
        date,
        exercise_name,
        sets_reps_weight,
        notes,
        client_id: id,
      });

    if (error) {
      form.setError("date", { message: error.message || "登録に失敗しました" });
      return;
    }

    router.push(`/clients/${id}/workouts`);
  };

  return (
    <div className="max-w-sm mx-auto py-10 flex flex-col gap-8">
      <h1 className="font-bold text-xl text-center">新しいワークアウトを追加</h1>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" placeholder="Select date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="exercise_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exercise Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter exercise name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sets_reps_weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sets, Reps, Weight</FormLabel>
                <FormControl>
                  <Input placeholder="Enter sets, reps, and weight" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter any notes" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">Submit</Button>

        </form>
      </Form>
    </div>
  )           
}
