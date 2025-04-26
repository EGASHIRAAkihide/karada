// utils/supabase/server.ts

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
// Database型がある場合だけこれを使う。なければ <any> でもOK
import { Database } from "@/types/supabase"; 

export const createClient = () => {
  return createServerComponentClient<Database>({ cookies });
};