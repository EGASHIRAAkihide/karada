// app/admin/activities/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useUserProfile } from "@/hooks/useUserProfile";

type Activity = {
  id: string;
  action: string;
  target?: string;
  metadata?: Record<string, any>;
  created_at: string;
};

export default function ActivityLogPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState<string | null>(null);

  // inside ActivityLogPage
  const { userProfile, loading: profileLoading } = useUserProfile();

  useEffect(() => {
    const fetchActivities = async () => {
      const supabase = createClient();
      let query = supabase.from("activities").select("*").order("created_at", { ascending: false }).limit(50);

      if (filterAction) {
        query = query.eq("action", filterAction);
      }
      if (filterDate) {
        query = query.like("created_at", `%${filterDate}%`);
      }

      const { data, error } = await query;

      if (!error) {
        setActivities(data as Activity[]);
      } else {
        console.error("ログ取得失敗:", error.message);
      }

      setLoading(false);
    };

    fetchActivities();
  }, [filterAction, filterDate]);

  if (profileLoading) {
    return <div>読み込み中...</div>;
  }

  if (!userProfile || userProfile.role !== "admin") {
    return <div>アクセス権限がありません。</div>;
  }

  return (
    <Card className="max-w-5xl mx-auto my-10 p-4">
      <CardHeader>
        <CardTitle>アクティビティログ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <Select value={filterAction ?? undefined} onValueChange={setFilterAction}>
            <SelectTrigger>
              <SelectValue placeholder="アクションでフィルタ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ログイン">ログイン</SelectItem>
              <SelectItem value="プロフィール更新">プロフィール更新</SelectItem>
              <SelectItem value="クライアント追加">クライアント追加</SelectItem>
              {/* 必要に応じて他のアクションを追加 */}
            </SelectContent>
          </Select>

          <DatePicker value={filterDate ?? undefined} onChange={setFilterDate} placeholder="日付でフィルタ" />
        </div>

        {loading ? (
          <p>読み込み中...</p>
        ) : activities.length === 0 ? (
          <p>アクティビティがまだ記録されていません。</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-40">日時</TableHead>
                <TableHead className="w-32">アクション</TableHead>
                <TableHead className="w-32">対象</TableHead>
                <TableHead>詳細</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>{new Date(activity.created_at).toLocaleString()}</TableCell>
                  <TableCell><Badge>{activity.action}</Badge></TableCell>
                  <TableCell>{activity.target || "-"}</TableCell>
                  <TableCell>
                    <pre className="whitespace-pre-wrap text-sm">
                      {activity.metadata ? JSON.stringify(activity.metadata, null, 2) : "-"}
                    </pre>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}