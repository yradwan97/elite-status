
import { TFunction } from "i18next";
import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export const getSignupSchema = (t: TFunction<"translation", undefined>) =>
  z
    .object({
      firstName: z.string().min(1, t("Auth.validation.required")),
      lastName: z.string().min(1, t("Auth.validation.required")),
      email: z
        .string()
        .min(1, t("Auth.validation.required"))
        .email(t("Auth.validation.emailInvalid")),

      mobileNumber: z.string().refine(isValidPhoneNumber, {
        message: t("Auth.validation.phoneInvalid"),
      }),

      password: z
        .string()
        .min(6, t("Auth.validation.passwordMin")),

      confirmPassword: z.string(),

      terms: z.boolean().refine((val) => val === true, {
        message: t("Auth.validation.acceptTerms"),
      }),

      IDFront: z
        .instanceof(File, { message: t("Auth.validation.required") })
        .refine((f) => f.size <= MAX_FILE_SIZE, t("Auth.validation.fileTooLarge"))
        .refine((f) => ACCEPTED_TYPES.includes(f.type), t("Auth.validation.fileInvalidType")),

      IDBack: z
        .instanceof(File, { message: t("Auth.validation.required") })
        .refine((f) => f.size <= MAX_FILE_SIZE, t("Auth.validation.fileTooLarge"))
        .refine((f) => ACCEPTED_TYPES.includes(f.type), t("Auth.validation.fileInvalidType")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("Auth.validation.passwordMatch"),
      path: ["confirmPassword"],
    });