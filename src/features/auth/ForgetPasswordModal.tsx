import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import z from "zod";
import { Mail } from "lucide-react";
import InputField from "./components/InputField";
import loginLogo from "@/assets/login-icon.png";
import { OptimizedImage } from "@/components/shared/OptimizedImage";
import { getForgetPasswordSchema } from "./schemas/forgetPasswordSchema";
import { useForgetPassword } from "./api/hooks/useForgetPassword";

export function ForgetPasswordModal({ onSwitch, onClose }: { onSwitch: () => void; onClose: () => void }) {
  const { t } = useTranslation();
  const schema = getForgetPasswordSchema(t);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const { mutate: forgetPassword, isPending } = useForgetPassword({
    onSuccess: () => {
      reset();
      onClose();
    },
  });

  type FormValues = z.infer<typeof schema>;

  const onSubmit = (data: FormValues) => {
    forgetPassword({
      email: data.email,
    });
  };

  return (


    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>


      <div className="w-full flex items-center justify-center">
        <OptimizedImage src={loginLogo} alt="login-logo" className="w-16 h-16" />
      </div>

      <h2 className="text-2xl font-semibold text-center my-4">
        {t("Auth.changePasswordTitle")}
      </h2>

      <InputField
        name="email"
        register={register}
        placeholder={t("Auth.email")}
        icon={Mail}
        error={errors.email?.message}
      />

      <button disabled={isPending} type="submit" className="bg-navy text-white py-3 text-lg rounded-lg font-medium">
        {t("Auth.submit")}
      </button>

      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-gray-400" style={{ fontSize: "1.05rem" }}>
          {t("Auth.or")}
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <button
        type="button"
        onClick={onSwitch}
        className="border py-3 rounded-lg font-medium text-lg"
      >
        {t("Auth.login")}
      </button>

    </form>
  );
}