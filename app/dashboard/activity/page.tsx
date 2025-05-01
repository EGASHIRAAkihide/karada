"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

type Activity = {
  id: string;
  user_id: string;
  action: string;
  target: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
};

export default function ActivityLogPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("ユーザー取得失敗", userError);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("アクティビティ取得失敗", error.message);
      } else {
        setActivities(data || []);
      }

      setLoading(false);
    };

    fetchActivities();
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">アクティビティログ</h1>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : activities.length === 0 ? (
        <p className="text-muted-foreground text-center">アクティビティがまだありません。</p>
      ) : (
        <ScrollArea className="h-[600px] pr-2">
          <div className="space-y-4">
            {activities.map((activity) => (
              <Card key={activity.id} className="rounded-xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">{activity.action}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  {activity.target && <p>対象: {activity.target}</p>}
                  {activity.metadata && (
                    <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                      {JSON.stringify(activity.metadata, null, 2)}
                    </pre>
                  )}
                  <Separator />
                  <p className="text-xs text-right text-gray-500">
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}