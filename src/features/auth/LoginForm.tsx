import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getLoginSchema } from "@/features/auth/schemas/loginSchema";
import { useTranslation } from "react-i18next";
import z from "zod";
import { Mail, Lock } from "lucide-react";
import InputField from "./components/InputField";
import loginLogo from "@/assets/login-icon.png";
import { toast } from "sonner";
import { useLogin } from "./api/hooks/useLogin";

export function LoginForm({ onSwitch, onClose }: { onSwitch: () => void; onClose: () => void }) {
  const { t } = useTranslation();
  const schema = getLoginSchema(t);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const { mutate: loginMutation, isPending } = useLogin({
    onSuccess: () => {
      toast.success(t("Auth.loginSuccess") ?? "Logged in successfully!");
      reset();
      onClose();
    },
    onError: (error: unknown) => {
      //@ts-expect-error api error typing
      const message = error?.response?.data?.message ?? t("Auth.loginError") ?? "Login failed.";
      toast.error(message);
    }
  });

  type FormValues = z.infer<typeof schema>;

  const onSubmit = (data: FormValues) => {
    loginMutation({
      email: data.email,
      password: data.password,
    });
  };

  return (


    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>


      <div className="w-full flex items-center justify-center">
        <img src={loginLogo} alt="login-logo" className="w-16 h-16" />
      </div>

      <h2 className="text-2xl font-semibold text-center my-4">
        {t("Auth.loginTitle")}
      </h2>

      <InputField
        name="email"
        register={register}
        placeholder={t("Auth.email")}
        icon={Mail}
        error={errors.email?.message}
      />

      <InputField
        name="password"
        register={register}
        placeholder={t("Auth.password")}
        icon={Lock}
        isPassword
        error={errors.password?.message}
      />

      <div className="text-right text-navy font-semibold cursor-pointer" style={{ fontSize: "1rem" }}>
        {t("Auth.forgetPassword")}
      </div>

      <button disabled={isPending} type="submit" className="bg-navy text-white py-3 text-lg rounded-lg font-medium">
        {t("Auth.login")}
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
        {t("Auth.createAccount")}
      </button>

    </form>
  );
}