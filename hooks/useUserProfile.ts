"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function useUserProfile() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single(); // ユーザーのプロファイル情報を取得

        if (error) {
          console.error("Error fetching profile:", error);
        } else {
          setUserProfile(data);
        }
      }

      setLoading(false);
    };

    fetchUserProfile();
  }, [supabase]);

  return { userProfile, loading };
}