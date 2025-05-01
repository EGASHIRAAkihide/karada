"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserProfile } from "@/hooks/useUserProfile";
import { createClient } from "@/utils/supabase/client";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Zodスキーマ定義
const ProfileSchema = z.object({
  name: z.string().min(1, "ユーザー名は必須です"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  role: z.enum(["admin", "user"]),
});

type ProfileFormValues = z.infer<typeof ProfileSchema>;

export default function ProfilePage() {
  const { userProfile, loading } = useUserProfile();
  const supabase = createClient();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: userProfile?.name || "",
      email: userProfile?.email || "",
      role: userProfile?.role || "user",
    },
  });

  useEffect(() => {
    if (userProfile) {
      form.reset({
        name: userProfile.name,
        email: userProfile.email,
        role: userProfile.role,
      });
    }
  }, [userProfile, form]);

  const updateProfile = async (values: ProfileFormValues) => {
    const { error } = await supabase
      .from("profiles")
      .update({
        name: values.name,
        email: values.email,
        role: values.role,
      })
      .eq("id", userProfile?.id);

    if (error) {
      throw new Error(error.message);
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      await updateProfile(values);
      alert("プロフィールを更新しました！");
    } catch (error) {
      alert("更新に失敗しました");
    }
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
