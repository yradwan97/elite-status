
import { TFunction } from "i18next";
import { z } from "zod";

export const getForgetPasswordSchema = (t: TFunction<"translation", undefined>) =>
  z.object({
    email: z
      .string()
      .min(1, t("Auth.validation.required"))
      .email(t("Auth.validation.emailInvalid")),
  });