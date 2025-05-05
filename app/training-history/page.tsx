"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

// 型定義
interface TrainingRequest {
  id: string;
  name: string;
  age: number;
  gender: string;
  goal: string;
  experience: string;
  equipment: string;
  concerns: string;
  prompt: string;
  created_at: string;
}

export default function TrainingHistoryPage() {
  const [requests, setRequests] = useState<TrainingRequest[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchRequests = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user?.id) {
        toast.error("ユーザー情報の取得に失敗しました");
        return;
      }

      const { data, error } = await supabase
        .from("training_requests")
        .select("*")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("データの取得に失敗しました");
        return;
      }

      setRequests(data || []);
    };

    fetchRequests();
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast("プロンプトをコピーしました");
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("training_requests").delete().eq("id", id);
    if (error) {
      toast.error("削除に失敗しました");
    } else {
      toast("削除しました");
      setRequests((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">保存されたトレーニングリクエスト</h1>

      {requests.length === 0 ? (
        <p className="text-center text-muted-foreground">まだプロンプトが保存されていません。</p>
      ) : (
        requests.map((req) => (
          <Card key={req.id}>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{req.name}（{req.age}歳・{req.gender}）</p>
                  <p className="text-sm text-muted-foreground">目的: {req.goal}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => handleCopy(req.prompt)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(req.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
              {expandedId === req.id && (
                <div className="prose bg-muted p-4 rounded-md max-h-[500px] overflow-y-auto">
                  <ReactMarkdown>{req.prompt}</ReactMarkdown>
                </div>
              )}
              <p className="text-xs text-right text-gray-400">作成日: {new Date(req.created_at).toLocaleString()}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}