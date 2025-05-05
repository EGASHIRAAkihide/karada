import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { age, gender, goal, experience, equipment, frequency, concern } = body;

  const prompt = `
    あなたはプロのパーソナルトレーナーです。
    以下の条件に基づいて、週${frequency}回のトレーニングメニューを提案してください。

    - 年齢: ${age}
    - 性別: ${gender}
    - 目的: ${goal}
    - 運動経験: ${experience}
    - 利用可能な器具: ${equipment}
    - 特別な悩み・配慮すべき点: ${concern || "特になし"}

    1日あたりのメニューを、曜日ごとにわかりやすく分けてください。
    `;

  const res = await fetch("https://api.together.xyz/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
    },
    body: JSON.stringify({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1", // Claudeなどへ変更可能
      messages: [
        { role: "system", content: "あなたは熟練のパーソナルトレーナーです。" },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    console.error("Together API エラー:", await res.text());
    return NextResponse.json({ result: "エラーが発生しました。" }, { status: 500 });
  }

  const json = await res.json();
  const message = json.choices?.[0]?.message?.content;

  return NextResponse.json({ result: message });
}