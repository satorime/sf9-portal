"use client";

import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changeAdminPassword } from "@/app/actions/admin-profile";
import { changePasswordSchema, type ChangePasswordInput } from "@/lib/validation/admin-schema";

export function ProfileForm() {
  const [state, formAction, isPending] = useActionState(changeAdminPassword, null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (state?.success) {
      reset();
    }
  }, [state, reset]);

  const onValid = (data: ChangePasswordInput) => {
    const formData = new FormData();
    formData.set("currentPassword", data.currentPassword);
    formData.set("newPassword", data.newPassword);
    formData.set("confirmPassword", data.confirmPassword);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <form onSubmit={handleSubmit(onValid)} noValidate className="space-y-4">
      <div>
        <label
          htmlFor="currentPassword"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Current Password
        </label>
        <input
          id="currentPassword"
          type="password"
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          {...register("currentPassword")}
        />
        {errors.currentPassword && (
          <p className="mt-1 text-xs text-red-600">{errors.currentPassword.message}</p>
        )}
        {state?.fieldErrors?.currentPassword && (
          <p className="mt-1 text-xs text-red-600">{state.fieldErrors.currentPassword[0]}</p>
        )}
      </div>
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
        {state?.fieldErrors?.newPassword && (
          <p className="mt-1 text-xs text-red-600">{state.fieldErrors.newPassword[0]}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Confirm New Password
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
      {state?.success && <p className="text-sm text-green-700 dark:text-green-400">{state.success}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Update Password"}
      </button>
    </form>
  );
}
