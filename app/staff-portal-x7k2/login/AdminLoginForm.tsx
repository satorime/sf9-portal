"use client";

import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginAdmin } from "@/app/actions/admin-auth";
import { adminLoginSchema, type AdminLoginInput } from "@/lib/validation/auth-schemas";

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(loginAdmin, null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginInput>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onValid = (data: AdminLoginInput) => {
    const formData = new FormData();
    formData.set("username", data.username);
    formData.set("password", data.password);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <form onSubmit={handleSubmit(onValid)} noValidate className="mt-6 space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Username
        </label>
        <input
          id="username"
          type="text"
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          {...register("username")}
        />
        {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>}
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          {...register("password")}
        />
        {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
