"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ProfileViewPage() {
  const supabase = createClient();
  const router = useRouter();
  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user?.id) return;

      const { data } = await supabase
        .from("profiles")
        .select("name, email, role")
        .eq("id", user.user.id)
        .single();

      if (data) setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, [supabase]);

  if (loading) return <p className="text-center mt-10">読み込み中...</p>;

  if (!profile)
    return <p className="text-center text-red-500 mt-10">プロフィールが見つかりませんでした</p>;

  return (
    <div className="max-w-md mx-auto py-10 space-y-6">
      <h1 className="text-xl font-bold text-center">プロフィール情報</h1>

      <div className="space-y-3 border p-6 rounded shadow">
        <div>
          <p className="text-sm text-muted-foreground">名前</p>
          <p className="font-medium">{profile.name}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">メールアドレス</p>
          <p className="font-medium">{profile.email}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">役割</p>
          <p className="font-medium">{profile.role === "admin" ? "管理者" : "ユーザー"}</p>
        </div>
      </div>

      <Button className="w-full" onClick={() => router.push("/dashboard/profile/edit")}>
        編集する
      </Button>
    </div>
  );
}