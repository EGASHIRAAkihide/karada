import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Client = {
  id: string;
  name: string;
  email: string;
};

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: client, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", params.id)
    .single<Client>();

  if (error || !client) {
    notFound(); // クライアントが存在しない場合404
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">クライアント詳細</h1>
      <div className="space-y-2">
        <p><span className="font-semibold">名前:</span> {client.name}</p>
        <p><span className="font-semibold">メールアドレス:</span> {client.email}</p>
      </div>

      <div className="flex gap-2">
        <Button asChild className="w-full max-w-[120px] mt-6">
          <Link href={`/clients/${client.id}/edit/`}>編集する</Link>
        </Button>

        <Button asChild className="w-full max-w-[120px] mt-6">
          <Link href={`/clients/${client.id}/workouts/`}>workouts</Link>
        </Button>
      </div>
    </div>
  );
}