"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { use, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const EditWorkoutSchema = z.object({
  date: z.string().min(1, { message: "日付を入力してください" }),
  exercise_name: z.string().min(1, { message: "種目を入力してください" }),
  sets_reps_weight: z.string().min(1, { message: "セット・回数・重量を入力してください" }),
  notes: z.string().optional(),
});

type EditWorkoutFormValues = z.infer<typeof EditWorkoutSchema>;

export default function EditWorkoutPage({ params }: { params: Promise<{ id: string; workoutId: string }> }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);

  const form = useForm<EditWorkoutFormValues>({
    resolver: zodResolver(EditWorkoutSchema),
    defaultValues: {
      date: "",
      exercise_name: "",
      sets_reps_weight: "",
      notes: "",
    },
  });

  const resolvedParams = use(params);
  const { id, workoutId } = resolvedParams;

  useEffect(() => {
    const fetchWorkout = async () => {
      if (!workoutId) return;

      const { data, error } = await supabase
        .from("workouts")
        .select("date, exercise_name, sets_reps_weight, notes")
        .eq("id", workoutId)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      form.reset({
        date: data.date,
        exercise_name: data.exercise_name,
        sets_reps_weight: data.sets_reps_weight,
        notes: data.notes ?? "",
      });
      setLoading(false);
    };

    fetchWorkout();
  }, [workoutId, supabase, form]);

  const onSubmit = async (values: EditWorkoutFormValues) => {
    const { date, exercise_name, sets_reps_weight, notes } = values;

    const { error } = await supabase
      .from("workouts")
      .update({ date, exercise_name, sets_reps_weight, notes })
      .eq("id", workoutId);

    if (error) {
      console.error(error);
      return;
    }

    router.push(`/clients/${id}/workouts/${workoutId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-10 flex flex-col gap-8">
      <h1 className="font-bold text-2xl text-center">ワークアウト編集</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>日付</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
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
                <FormLabel>種目</FormLabel>
                <FormControl>
                  <Input placeholder="種目を入力" {...field} />
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
                <FormLabel>セット・回数・重量</FormLabel>
                <FormControl>
                  <Input placeholder="例: 3セット × 10回 × 50kg" {...field} />
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
                <FormLabel>メモ</FormLabel>
                <FormControl>
                  <Textarea placeholder="任意でメモを入力" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            更新する
          </Button>
        </form>
      </Form>
    </div>
  );
}