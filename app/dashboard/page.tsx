"use client";

import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { loading } = useAuthRedirect();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-20 space-y-6 text-center">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>ここはログイン後に表示されるダッシュボードです。</p>
      <Button onClick={handleLogout}>サインアウト</Button>
      <ul>

      </ul>
    </div>
  );
}