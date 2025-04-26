"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const EditClientSchema = z.object({
  name: z.string().min(1, { message: "名前を入力してください" }),
  email: z.string().email({ message: "正しいメールアドレスを入力してください" }),
});

type EditClientFormValues = z.infer<typeof EditClientSchema>;

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);

  const form = useForm<EditClientFormValues>({
    resolver: zodResolver(EditClientSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  // Use React.use() to await the params Promise
  useEffect(() => {
    const fetchClient = async () => {
      // Ensure params.id is unwrapped by using React.use()
      const paramId = await params.id;  // Await params.id to get the resolved value
      if (!paramId) {
        return;
      }

      const { data, error } = await supabase
        .from("clients")
        .select("name, email")
        .eq("id", paramId)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      form.reset({
        name: data.name,
        email: data.email,
      });
      setLoading(false);
    };

    // Fetch client when params are available
    fetchClient();
  }, [params, supabase, form]);

  const onSubmit = async (values: EditClientFormValues) => {
    const { name, email } = values;

    const { error } = await supabase
      .from("clients")
      .update({ name, email })
      .eq("id", params.id); // Use params.id as awaited value

    if (error) {
      console.error(error);
      return;
    }

    router.push("/clients");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-sm mx-auto py-10 flex flex-col gap-8">
      <h1 className="font-bold text-xl text-center">Edit Client</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            保存する
          </Button>

        </form>
      </Form>
    </div>
  );
}