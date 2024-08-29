"use client";
import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import { getSession } from "next-auth/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z
    .string()
});

interface LoginFormInputs {
  username: string;
  password: string;
}

const LoginForm = () => {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    //console.log("Session data:", session);
  }, [session]);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    const result = await signIn("credentials", {
      redirect: false,
      username: data.username,
      password: data.password,
    });

    if (result?.error) {
      setMessage("Invalid Credentials");
    } else {
      // setMessage("Login successful");
  
      // Ensure `result` is defined and cast it to the expected type
      if (result && result.ok && session?.user) {
        const session = await getSession();
        if (session?.user) {
            const role = session.user.role;
            console.log("Role:", role);

            if (role === 'buyer') {
                router.push("/buyer/dashboard");
            } else {
                router.push("/seller/dashboard");
            }
        }
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded">
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
            >
              Log In
            </button>
          </form>
        </Form>
        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes("successful") ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
        <p className="mt-4 text-center">
          New user?{" "}
          <a href="/register" className="text-blue-500">
            Create Account
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;