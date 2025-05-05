"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type TrainingRequest = {
  id: string;
  prompt: string;
  created_at: string;
};

export default function TrainingHistoryPage() {
  const [history, setHistory] = useState<TrainingRequest[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchHistory = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        toast.error("ログイン情報が取得できませんでした");
        return;
      }

      const { data, error } = await supabase
        .from("training_requests")
        .select("id, prompt, created_at")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("履歴取得エラー:", error);
        toast.error("履歴の取得に失敗しました");
      } else {
        setHistory(data);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold text-center">プロンプト履歴一覧</h1>
      {history.length === 0 ? (
        <p className="text-center text-muted-foreground">まだ保存された履歴がありません。</p>
      ) : (
        history.map((item) => (
          <Card key={item.id} className="bg-muted">
            <CardContent className="space-y-2 p-4">
              <Label className="text-sm text-muted-foreground">
                作成日: {new Date(item.created_at).toLocaleString()}
              </Label>
              <Textarea readOnly className="min-h-[200px]" value={item.prompt} />
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}