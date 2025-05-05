import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/dashboard/profile">Profile</Link>
      <Link href="/dashboard/profile/edit">Edit Profile</Link>
      <Link href="/dashboard/activity">Activity</Link>
      <Link href="/ai-trainer">AI Trainer</Link>
      <Link href="/ai-trainer/history" className="text-blue-600 underline">AI trainer History</Link>
    </div>
  );
}
