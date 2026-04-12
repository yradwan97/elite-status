
import { TFunction } from "i18next";
import { z } from "zod";

export const getLoginSchema = (t: TFunction<"translation", undefined>) =>
  z.object({
    email: z
      .string()
      .min(1, t("Auth.validation.required"))
      .email(t("Auth.validation.emailInvalid")),

    password: z
      .string()
      .min(1, t("Auth.validation.required"))
      .min(6, t("Auth.validation.passwordMin")),
  });