import { z } from "zod";

export const createUserSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phoneNumber: z
    .string()
    .regex(/^(?:\+8801|01)[0-9]{9}$/, "Invalid phone number"),
  vehicles: z
    .array(
      z.object({
        licensePlate: z.string().min(1, "License plate is required"),
        make: z.string().optional(),
        model: z.string().optional(),
        color: z.string().optional(),
      })
    )
    .optional(),
});

export const findOneUserSchema = z.object({
  id: z.uuid("Invalid UUID format"),
});
export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
export const updateUserSchema = z
  .object({
    fullName: z.string().optional(),
    phoneNumber: z.string().optional(),
  })
  .strict();
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type loginInput = z.infer<typeof loginSchema>;
export type updateInput = z.infer<typeof updateUserSchema>;
