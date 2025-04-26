"use client";

import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useUserProfile } from "@/hooks/useUserProfile";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { loading: authLoading } = useAuthRedirect();
  const { userProfile, loading: profileLoading } = useUserProfile();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (authLoading || profileLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-20 space-y-6 text-center">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="space-y-4">
        <p><strong>名前:</strong> {userProfile?.name || "名前未設定"}</p>
        <p><strong>Email:</strong> {userProfile?.email}</p>
        <p><strong>会員ID:</strong> {userProfile?.id}</p>
      </div>

      <Button onClick={handleLogout}>サインアウト</Button>
    </div>
  );
}