import { z } from "zod";

export const studentLoginSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  lrn: z
    .string()
    .trim()
    .length(12, "LRN must be exactly 12 digits")
    .regex(/^\d{12}$/, "LRN must contain only digits"),
  password: z.string().min(1, "Password is required"),
});

export type StudentLoginInput = z.infer<typeof studentLoginSchema>;

export const setPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SetPasswordInput = z.infer<typeof setPasswordSchema>;

export const adminLoginSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
