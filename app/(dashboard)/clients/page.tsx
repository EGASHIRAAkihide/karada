import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";

export default async function ClientsPage() {
  const supabase = createClient();

  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (!clients || clients.length === 0) {
    return <div className="py-10 text-center">クライアントが登録されていません</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Button asChild>
          <Link href="/clients/new">新規登録</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {clients.map((client) => (
          <div key={client.id} className="border rounded p-4">
            <Link href={`/clients/${client.id}`} className="text-lg font-semibold hover:underline">
              {client.name}
            </Link>
            <p className="text-sm text-gray-600">{client.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}