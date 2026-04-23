import z from "zod";

export const getChangePasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      currentPassword: z.string().min(1, t('Auth.validation.required') ?? 'Required'),
      newPassword: z
        .string()
        .min(8, t('Auth.validation.passwordMin') ?? 'At least 8 characters'),
      confirmPassword: z.string().min(1, t('Auth.validation.required') ?? 'Required'),
    })
    .refine((d) => d.newPassword === d.confirmPassword, {
      message: t('Auth.validation.passwordMatch') ?? 'Passwords do not match',
      path: ['confirmPassword'],
    });