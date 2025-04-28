import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default async function ClientWorkoutsPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = createClient();

  const resolvedParams = await params; // ★★★ Promiseをawaitして中身を取り出す！
  const { id } = resolvedParams;

  const { data: workouts, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('client_id', id)
    .order('date', { ascending: false });

  if (error) {
    console.error("Error fetching workouts:", error);
    return notFound();
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">トレーニング記録一覧</h1>

      <div className="mb-4">
        <Link href={`/clients/${id}/workouts/new`}>
          <Button className="w-full">新しいワークアウトを追加</Button>
        </Link>
      </div>

      {workouts.length === 0 ? (
        <p>まだトレーニング記録がありません。</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>日付</TableCell>
              <TableCell>種目</TableCell>
              <TableCell>セット・回数・重量</TableCell>
              <TableCell>メモ</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workouts.map((workout) => (
              <TableRow key={workout.id}>
                <TableCell>{workout.date}</TableCell>
                <TableCell>
                  <Link href={`/clients/${id}/workouts/${workout.id}`} className="text-blue-600 hover:underline">
                    {workout.exercise_name}
                  </Link>
                </TableCell>
                <TableCell>{workout.sets_reps_weight}</TableCell>
                <TableCell>
                  <Badge variant="outline">{workout.notes ?? '-'}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
