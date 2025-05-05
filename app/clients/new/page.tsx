"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { logActivity } from "@/lib/logActivity";
import { toast } from "sonner";

// 1. Zodでバリデーションルールを定義
const ClientSchema = z.object({
  name: z.string().min(1, { message: "名前は必須です" }),
  email: z.string().email({ message: "正しいメールアドレスを入力してください" }),
});

type ClientFormValues = z.infer<typeof ClientSchema>;

export default function NewClientPage() {
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(ClientSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = async (values: ClientFormValues) => {
    const { name, email } = values;
  
    const { data, error } = await supabase
      .from("clients")
      .insert({ name, email })
      .select()
      .single();
  
    if (error) {
      toast.error("登録に失敗しました");
      form.setError("name", { message: error.message || "登録に失敗しました" });
      return;
    }
  
    await logActivity("クライアント追加", "clients", {
      name,
      email,
      clientId: data.id,
    });
  
    toast.success("クライアントを登録しました");
    router.push("/clients");
  };

  return (
    <div className="max-w-sm mx-auto py-10 flex flex-col gap-8">
      <h1 className="font-bold text-xl text-center">新しいクライアントを登録</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>名前</FormLabel>
                <FormControl>
                  <Input placeholder="クライアント名" {...field} />
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
                  <Input placeholder="client@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            登録する
          </Button>

        </form>
      </Form>
    </div>
  );
}