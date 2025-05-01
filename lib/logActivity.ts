import { createClient } from "@/utils/supabase/client";

/**
 * ユーザーアクションをアクティビティログに記録
 * 
 * @param action アクションの説明（例: "ログイン", "プロフィール更新"）
 * @param target 対象リソース（例: "clients", "settings"）
 * @param metadata 追加情報（任意）
 */
export async function logActivity(
  action: string,
  target?: string,
  metadata?: Record<string, any>
) {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("ログインユーザーが見つかりません:", userError);
    return;
  }

  const { error } = await supabase.from("activities").insert([
    {
      user_id: user.id,
      action,
      target,
      metadata,
    },
  ]);

  if (error) {
    console.error("アクティビティログ記録に失敗:", error.message);
  }
}