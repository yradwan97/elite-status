import { useMutation } from "@tanstack/react-query";
import { registerApi } from "../authApi";
import { uploadApi } from "../uploadApi";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface RegisterFormPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobileNumber: string;
  IDFront: File;
  IDBack: File;
}

interface UseRegisterOptions {
  onSuccess?: () => void;
  onError?: (error: Error | string | unknown) => void;
}

export function useRegister({ onSuccess, onError }: UseRegisterOptions = {}) {
  const { t } = useTranslation();
  return useMutation({
    mutationFn: async (payload: RegisterFormPayload) => {
      let IDFront: string;
      let IDBack: string;

      try {
        [IDFront, IDBack] = await Promise.all([
          uploadApi(payload.IDFront),
          uploadApi(payload.IDBack),
        ]);
      } catch {
        toast.error(t("Auth.uploadError") ?? "Failed to upload ID images.");
        throw new Error("upload_failed");
      }

      return registerApi({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        password: payload.password,
        mobileNumber: payload.mobileNumber,
        IDFront,
        IDBack,
      });
    },
    onSuccess,
    onError: (error: Error | string | unknown) => {
      if (error instanceof Error && error.message === "upload_failed") return; // already toasted
      onError?.(error);
    },
  });
}