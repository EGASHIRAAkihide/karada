"use client";

import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Button } from "@/components/ui/button";
import { useDashboardData } from "@/hooks/useDashboardData";
import { createClient } from "@/utils/supabase/client";

export default function DashboardPage() {
  const { loading: authLoading } = useAuthRedirect();
  const { userProfile, loading: profileLoading } = useUserProfile();
  const { stats, loading: dataLoading } = useDashboardData();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (authLoading || profileLoading || dataLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-20 px-4 space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-gray-600">ようこそ、{userProfile?.email} さん</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-gray-100 rounded-xl shadow">
          <h2 className="text-xl font-semibold">登録クライアント数</h2>
          <p className="text-3xl mt-2">{stats.clientsCount}</p>
        </div>
        <div className="p-6 bg-gray-100 rounded-xl shadow">
          <h2 className="text-xl font-semibold">今月のログイン</h2>
          <p className="text-3xl mt-2">{stats.loginCount}</p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">最近のアクティビティ</h2>
        <ul className="space-y-3 text-sm">
          {stats.recentActivities.length > 0 ? (
            stats.recentActivities.map((activity) => (
              <li key={activity.id}>
                {activity.action} - {new Date(activity.created_at).toLocaleDateString()}
              </li>
            ))
          ) : (
            <li>最近のアクティビティはありません。</li>
          )}
        </ul>
      </section>

      <section className="flex justify-center gap-4">
        <Button asChild>
          <a href="/clients">クライアント一覧を見る</a>
        </Button>
        <Button asChild variant="outline">
          <a href="/settings">設定</a>
        </Button>
      </section>

      <div className="text-center">
        <Button onClick={handleLogout}>サインアウト</Button>
      </div>
    </div>
  );
}