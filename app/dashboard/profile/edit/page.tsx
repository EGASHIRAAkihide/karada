"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

const ProfileSchema = z.object({
  name: z.string().min(1, { message: "ユーザー名は必須です" }),
  email: z.string().email({ message: "有効なメールアドレスを入力してください" }),
  role: z.enum(["admin", "user"]),
});

type ProfileFormValues = z.infer<typeof ProfileSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "user",
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user?.id) return;
  
      setUserId(user.user.id); // ユーザーIDを保存
  
      const { data, error } = await supabase
        .from("profiles")
        .select("name, email, role")
        .eq("id", user.user.id)
        .single();

      if (error) {
        console.error(error);
        toast.error("クライアント情報の取得に失敗しました");
        return;
      }
  
      if (data) {
        form.reset({
          name: data.name,
          email: data.email,
          role: data.role,
        });
      }

      console.log("Updated data:", data);
      setLoading(false);
    };
  
    fetchProfile();
  }, [supabase, form]);
  
  const onSubmit = async (values: ProfileFormValues) => {
    if (!userId) return; // 念のためnullチェック
  
    const { name, email, role } = values;
  
    const { error } = await supabase
      .from("profiles")
      .update({ name, email, role })
      .eq("id", userId);
  
    if (error) {
      toast.error("プロフィールの更新に失敗しました");
      console.error(error);
      return;
    }
  
    toast.success("プロフィールを更新しました！");
    router.push("/dashboard/profile");
  };

  if (loading) return <p className="text-center mt-10">読み込み中...</p>;

  return (
    <div className="max-w-sm mx-auto py-10 flex flex-col gap-8">
      <h1 className="font-bold text-xl text-center">プロフィール編集</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ユーザー名</FormLabel>
                <FormControl>
                  <Input placeholder="ユーザー名" {...field} />
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
                <FormLabel>メールアドレス</FormLabel>
                <FormControl>
                  <Input placeholder="メールアドレス" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>権限</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">ユーザー</SelectItem>
                      <SelectItem value="admin">管理者</SelectItem>
                    </SelectContent>
                  </Select>
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