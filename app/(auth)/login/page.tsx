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

// 1. Zodでフォームバリデーションスキーマを定義
const LoginSchema = z.object({
  email: z.string().email({ message: "正しいメールアドレスを入力してください" }),
  password: z.string().min(6, { message: "パスワードは6文字以上で入力してください" }),
});

type LoginFormValues = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    const { email, password } = values;
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      form.setError("email", { message: "ログインに失敗しました。メールアドレスまたはパスワードを確認してください。" });
      return;
    }

    await logActivity("ログイン", "auth", {
      email,
    });

    router.push("/dashboard");
  };

  return (
    <div className="max-w-sm mx-auto py-10 flex flex-col gap-8">
      <h1 className="font-bold text-xl text-center">Login</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage /> {/* ここでエラー表示 */}
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage /> {/* ここでエラー表示 */}
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full cursor-pointer">
            ログイン
          </Button>

        </form>
      </Form>
    </div>
  );
}