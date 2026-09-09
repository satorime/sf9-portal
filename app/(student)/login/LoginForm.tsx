"use client";

import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginStudent } from "@/app/actions/student-auth";
import { studentLoginSchema, type StudentLoginInput } from "@/lib/validation/auth-schemas";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginStudent, null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentLoginInput>({
    resolver: zodResolver(studentLoginSchema),
    defaultValues: { fullName: "", lrn: "", password: "" },
  });

  const onValid = (data: StudentLoginInput) => {
    const formData = new FormData();
    formData.set("fullName", data.fullName);
    formData.set("lrn", data.lrn);
    formData.set("password", data.password);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <form onSubmit={handleSubmit(onValid)} noValidate className="space-y-4">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Student&apos;s Name
        </label>
        <input
          id="fullName"
          type="text"
          placeholder="e.g., Juan Dela Cruz"
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          {...register("fullName")}
        />
        {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>}
      </div>

      <div>
        <label htmlFor="lrn" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          LRN
        </label>
        <input
          id="lrn"
          type="text"
          inputMode="numeric"
          maxLength={12}
          placeholder="Enter your LRN"
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          {...register("lrn")}
        />
        {errors.lrn && <p className="mt-1 text-xs text-red-600">{errors.lrn.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          {...register("password")}
        />
        {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold tracking-wide text-white uppercase transition-colors hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? "Checking..." : "View My Card"}
      </button>

      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        <span className="font-medium">Important:</span> your LRN must be entered exactly as recorded by
        the school. Name order doesn&apos;t matter, but it must match your first and last name on file. If
        this is your first time logging in, your password is your LRN.
      </p>
    </form>
  );
}
