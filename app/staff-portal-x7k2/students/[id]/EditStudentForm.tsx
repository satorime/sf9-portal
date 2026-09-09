"use client";

import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Student } from "@prisma/client";
import { updateStudent } from "@/app/actions/admin-students";
import { updateStudentSchema, type UpdateStudentInput } from "@/lib/validation/student-schema";

export function EditStudentForm({ student }: { student: Student }) {
  const [state, formAction, isPending] = useActionState(updateStudent, null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateStudentInput>({
    resolver: zodResolver(updateStudentSchema),
    defaultValues: {
      studentId: student.id,
      fullName: student.fullName,
      gradeLevel: student.gradeLevel,
      section: student.section,
    },
  });

  const onValid = (data: UpdateStudentInput) => {
    const formData = new FormData();
    formData.set("studentId", data.studentId);
    formData.set("fullName", data.fullName);
    formData.set("gradeLevel", data.gradeLevel);
    formData.set("section", data.section);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <form onSubmit={handleSubmit(onValid)} noValidate className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <input type="hidden" {...register("studentId")} />
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Full Name
        </label>
        <input
          id="fullName"
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
      <div className="flex items-end">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
      {state?.error && <p className="col-span-2 text-sm text-red-600">{state.error}</p>}
      {state?.success && (
        <p className="col-span-2 text-sm text-green-700 dark:text-green-400">{state.success}</p>
      )}
    </form>
  );
}
