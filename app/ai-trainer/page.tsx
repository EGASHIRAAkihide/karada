"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

export default function TrainingPromptPage() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [goal, setGoal] = useState("");
  const [experience, setExperience] = useState("");
  const [equipment, setEquipment] = useState("");
  const [considerations, setConsiderations] = useState("");
  const [prompt, setPrompt] = useState("");
  const supabase = createClient();

  const generatePrompt = async () => {
    const basePrompt = `あなたは優秀なパーソナルトレーナーです。以下の顧客情報をもとに、個別最適化されたトレーニングメニュー（週3回）を日本語でMarkdown形式で提案してください。
  
  # 顧客情報
  - 名前: ${name}
  - 年齢: ${age}
  - 性別: ${gender}
  - 目的: ${goal}
  - トレーニング経験: ${experience}
  - 利用可能な器具: ${equipment}
  - 特別な悩み・配慮すべき点: ${considerations}
  
  # 出力形式
  - タイトル（顧客名入り）
  - 概要（目的や配慮点に基づいた戦略）
  - 日別トレーニングメニュー（3日分）
  - アドバイス`;
  
    setPrompt(basePrompt);
  
    // Supabaseに保存
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      toast.error("ログインしていないか、ユーザー情報の取得に失敗しました");
      return;
    }
  
    const { error: insertError } = await supabase.from("training_requests").insert({
      user_id: userData.user.id,
      name,
      age: parseInt(age),
      gender,
      goal,
      experience,
      equipment,
      concerns: considerations,
      prompt: basePrompt,
    });
  
    if (insertError) {
      console.error("Supabase insert error:", insertError);
      toast.error("データの保存に失敗しました");
      return;
    }
  
    toast.success("プロンプトを生成し、保存しました！");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(prompt);
    toast("プロンプトをコピーしました");
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">
      <h1 className="text-2xl font-bold text-center">パーソナルトレーニング プロンプト生成</h1>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">名前</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="例: 山田太郎" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">年齢</Label>
          <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="例: 25" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">性別</Label>
          <Select onValueChange={setGender}>
            <SelectTrigger id="gender">
              <SelectValue placeholder="性別を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="男性">男性</SelectItem>
              <SelectItem value="女性">女性</SelectItem>
              <SelectItem value="その他">その他</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="goal">目的</Label>
          <Textarea id="goal" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="例: ダイエット、筋肥大、体力向上など" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience">運動経験</Label>
          <Textarea id="experience" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="例: 初心者、2年経験あり、ジム通い中" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="equipment">利用可能な器具</Label>
          <Textarea id="equipment" value={equipment} onChange={(e) => setEquipment(e.target.value)} placeholder="例: ヨガマット、ダンベル" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="considerations">特別な悩み・配慮すべき点</Label>
          <Textarea id="considerations" value={considerations} onChange={(e) => setConsiderations(e.target.value)} placeholder="例: 膝が弱い、腰痛がある など" />
        </div>

        <Button className="w-full" onClick={generatePrompt}>
          プロンプトを生成する
        </Button>
      </div>

      {prompt && (
        <Card className="bg-muted">
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="prompt">生成されたプロンプト</Label>
              <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                <Copy className="h-5 w-5" />
              </Button>
            </div>
            <Textarea
              id="prompt"
              value={prompt}
              readOnly
              className="min-h-[300px] bg-background cursor-text"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
