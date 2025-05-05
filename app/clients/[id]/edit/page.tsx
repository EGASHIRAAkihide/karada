"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { use, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

const EditClientSchema = z.object({
  name: z.string().min(1, { message: "名前を入力してください" }),
  email: z.string().email({ message: "正しいメールアドレスを入力してください" }),
});

type EditClientFormValues = z.infer<typeof EditClientSchema>;

export default function Page({ params }: { params: Promise<{ id: string; workoutId: string }> }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);

  const form = useForm<EditClientFormValues>({
    resolver: zodResolver(EditClientSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const resolvedParams = use(params);
  const { id } = resolvedParams;

  useEffect(() => {
    const fetchClient = async () => {
      const paramId = await id; 
      if (!paramId) {
        return;
      }

      const { data, error } = await supabase
        .from("clients")
        .select("name, email")
        .eq("id", paramId)
        .single();

      if (error) {
        console.error(error);
        toast.error("クライアント情報の取得に失敗しました");
        return;
      }

      form.reset({
        name: data.name,
        email: data.email,
      });
      setLoading(false);
    };

    // Fetch client when params are available
    fetchClient();
  }, [supabase, form, id]);

  const onSubmit = async (values: EditClientFormValues) => {
    const { name, email } = values;

    const { error } = await supabase
      .from("clients")
      .update({ name, email })
      .eq("id", id); // Use params.id as awaited value

    if (error) {
      toast.error("クライアントの更新に失敗しました");
      console.error(error);
      return;
    }

    toast.success("クライアントを更新しました");
    router.push("/clients");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-sm mx-auto py-10 flex flex-col gap-8">
      <h1 className="font-bold text-xl text-center">Edit Client</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            保存する
          </Button>

        </form>
      </Form>
    </div>
  );
}