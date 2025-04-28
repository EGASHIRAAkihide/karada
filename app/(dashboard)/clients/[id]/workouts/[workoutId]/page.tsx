import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function WorkoutDetailPage({ params }: { params: { id: string; workoutId: string } }) {
  const supabase = await createClient();

  const { data: workout, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('id', params.workoutId)
    .single();

  if (error || !workout) {
    console.error(error);
    return notFound();
  }

  async function handleDelete() {
    "use server";
    const supabase = await createClient();
    await supabase.from('workouts').delete().eq('id', params.workoutId);
    redirect(`/clients/${params.id}/workouts`);
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">ワークアウト詳細</h1>
      <div className="space-y-4">
        <div>日付: {workout.date}</div>
        <div>種目: {workout.exercise_name}</div>
        <div>セット・回数・重量: {workout.sets_reps_weight}</div>
        <div>メモ: {workout.notes ?? '-'}</div>
      </div>

      <div className="flex space-x-2 mt-6">
        <Link href={`/clients/${params.id}/workouts/${params.workoutId}/edit`}>
          <Button>編集</Button>
        </Link>
        <form action={handleDelete}>
          <Button variant="destructive" type="submit">削除</Button>
        </form>
      </div>
    </div>
  );
}