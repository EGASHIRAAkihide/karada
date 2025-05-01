import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export const useDashboardData = () => {
  const supabase = createClient();
  const [stats, setStats] = useState<{
    clientsCount: number;
    loginCount: number;
    recentActivities: any[];
  }>({
    clientsCount: 0,
    loginCount: 0,
    recentActivities: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // クライアント数を取得
        const { data: clients } = await supabase.from("clients").select("*");
        const clientsCount = clients?.length || 0;

        // 最近のアクティビティを取得
        const { data: activities } = await supabase
          .from("activities")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);

        setStats({
          clientsCount,
          loginCount: 8, // ログイン回数（例: トラッキングなどで取得）
          recentActivities: activities || [],
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { stats, loading };
};