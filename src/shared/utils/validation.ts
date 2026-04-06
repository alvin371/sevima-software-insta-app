import { z } from "zod";

export const loginSchema = z.object({
  // Field accepts either an email address or a username
  email: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters").max(60),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30)
      .regex(/^[a-z0-9_.]+$/, "Username can only contain letters, numbers, . and _"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const captionSchema = z.object({
  caption: z.string().max(2200, "Caption cannot exceed 2200 characters").optional(),
  location: z.string().max(100).optional(),
});

export const editProfileSchema = z.object({
  fullName: z.string().min(2).max(60),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_.]+$/),
  bio: z.string().max(150).optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CaptionFormData = z.infer<typeof captionSchema>;
export type EditProfileFormData = z.infer<typeof editProfileSchema>;
