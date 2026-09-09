"use client";

import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createStudent } from "@/app/actions/admin-students";
import { createStudentSchema, type CreateStudentInput } from "@/lib/validation/student-schema";

export function NewStudentForm() {
  const [state, formAction, isPending] = useActionState(createStudent, null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateStudentInput>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: { lrn: "", fullName: "", gradeLevel: "GRADE_7", section: "" },
  });

  const onValid = (data: CreateStudentInput) => {
    const formData = new FormData();
    formData.set("lrn", data.lrn);
    formData.set("fullName", data.fullName);
    formData.set("gradeLevel", data.gradeLevel);
    formData.set("section", data.section);
    startTransition(() => {
      formAction(formData);
    });
  };

  // Surface server-side duplicate-LRN errors (can't be known client-side) on the same field.
  useEffect(() => {
    if (state?.fieldErrors?.lrn) {
      setError("lrn", { message: state.fieldErrors.lrn[0] });
    }
  }, [state, setError]);

  return (
    <form onSubmit={handleSubmit(onValid)} noValidate className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="lrn" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          LRN
        </label>
        <input
          id="lrn"
          inputMode="numeric"
          maxLength={12}
          placeholder="12-digit LRN"
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          {...register("lrn")}
        />
        {errors.lrn && <p className="mt-1 text-xs text-red-600">{errors.lrn.message}</p>}
      </div>
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Full Name
        </label>
        <input
          id="fullName"
          placeholder="Last name, First name, Middle name"
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          {...register("fullName")}
        />
        {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>}
      </div>
      <div>
        <label htmlFor="gradeLevel" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Grade Level
        </label>
        <select
          id="gradeLevel"
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          {...register("gradeLevel")}
        >
          <option value="GRADE_7">Grade 7</option>
          <option value="GRADE_8">Grade 8</option>
          <option value="GRADE_9">Grade 9</option>
          <option value="GRADE_10">Grade 10</option>
        </select>
      </div>
      <div>
        <label htmlFor="section" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Section
        </label>
        <input
          id="section"
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          {...register("section")}
        />
        {errors.section && <p className="mt-1 text-xs text-red-600">{errors.section.message}</p>}
      </div>
      <p className="col-span-2 text-xs text-zinc-500 dark:text-zinc-400">
        The student&apos;s LRN will be set as their temporary password. They&apos;ll be required to set a
        permanent password on first login.
      </p>
      {state?.error && <p className="col-span-2 text-sm text-red-600">{state.error}</p>}
      <div className="col-span-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "Creating..." : "Create Student"}
        </button>
      </div>
    </form>
  );
}
