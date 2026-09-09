"use client";

import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setPassword } from "@/app/actions/student-auth";
import { setPasswordSchema, type SetPasswordInput } from "@/lib/validation/auth-schemas";

export function SetPasswordForm() {
  const [state, formAction, isPending] = useActionState(setPassword, null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SetPasswordInput>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onValid = (data: SetPasswordInput) => {
    const formData = new FormData();
    formData.set("newPassword", data.newPassword);
    formData.set("confirmPassword", data.confirmPassword);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <form onSubmit={handleSubmit(onValid)} noValidate className="mt-6 space-y-4">
      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          New Password
        </label>
        <input
          id="newPassword"
          type="password"
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          {...register("newPassword")}
        />
        {errors.newPassword && <p className="mt-1 text-xs text-red-600">{errors.newPassword.message}</p>}
      </div>
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save Password"}
      </button>
    </form>
  );
}
