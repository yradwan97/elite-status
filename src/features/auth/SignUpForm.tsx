import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSignupSchema } from "@/features/auth/schemas/signupSchema";
import { useTranslation } from "react-i18next";
import z from "zod";
import PhoneField from "./components/PhoneField";
import InputField from "./components/InputField";
import { IDUploadField } from "./components/IdUploadField";
import i18n from "@/i18n";
import { useRegister } from "./api/hooks/useRegister";
import {toast} from "sonner";

export function SignupForm({ onSwitch }: { onSwitch: () => void }) {
  const { t } = useTranslation();
  const schema = getSignupSchema(t);
  type FormValues = z.infer<typeof schema>;

  const { mutate: registerMutation, isPending } = useRegister({
    onSuccess: () => {
      toast.success(t("Auth.registerSuccess") ?? "Account created successfully!");
      reset();
      onSwitch();
    },
    onError: (error: unknown) => {
      //@ts-expect-error api error typing
      const message =  error?.response?.data?.message ?? t("Auth.registerError") ?? "Registration failed.";
      toast.error(message);
    },
  });

const onSubmit = (data: FormValues) => {
  registerMutation({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
    mobileNumber: data.mobileNumber,
    IDFront: data.IDFront,
    IDBack: data.IDBack,
  });
};

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-2xl font-semibold text-center">
        {t("Auth.signupTitle")}
      </h2>

      <div className={`flex gap-4 ${i18n.language === "ar" ? "flex-row-reverse" : ""}`}>
        <InputField
          name="firstName"
          register={register}
          placeholder={t("Auth.firstName")}
          error={errors.firstName?.message}
        />
        <InputField
          name="lastName"
          register={register}
          placeholder={t("Auth.lastName")}
          error={errors.lastName?.message}
        />
      </div>

      <InputField
        name="email"
        register={register}
        placeholder={t("Auth.email")}
        error={errors.email?.message}
      />

      <Controller
        control={control}
        name="mobileNumber"
        render={({ field }) => <PhoneField {...field} />}
      />
      {errors.mobileNumber && (
        <p className="text-red-500 text-sm">{errors.mobileNumber.message}</p>
      )}

      <InputField
        name="password"
        register={register}
        placeholder={t("Auth.password")}
        isPassword
        error={errors.password?.message}
      />

      <InputField
        name="confirmPassword"
        register={register}
        placeholder={t("Auth.confirmPassword")}
        isPassword
        error={errors.confirmPassword?.message}
      />

      <label className="flex items-center self-start gap-2" style={{ fontSize: "1.05rem" }}>
        <input type="checkbox" {...register("terms")} />
        {t("Auth.agreeTerms")}
      </label>

      {errors.terms && (
        <p className="text-red-500 text-sm">{errors.terms.message}</p>
      )}

      <div className="flex flex-col gap-1 pt-2">
        <p className="text-sm font-semibold text-gray-700">
          {t("Auth.idVerification") ?? "ID Verification"}
        </p>
        <div className="flex gap-3">
          <Controller
            control={control}
            name="IDFront"
            render={({ field }) => (
              <IDUploadField
                label={t("Auth.idFront") ?? "ID Front"}
                value={field.value ?? null}
                onChange={field.onChange}
                error={errors.IDFront?.message as string}
              />
            )}
          />
          <Controller
            control={control}
            name="IDBack"
            render={({ field }) => (
              <IDUploadField
                label={t("Auth.idBack") ?? "ID Back"}
                value={field.value ?? null}
                onChange={field.onChange}
                error={errors.IDBack?.message as string}
              />
            )}
          />
        </div>
      </div>

      <button type="submit" disabled={isPending} className="bg-navy text-white py-3 text-lg rounded-lg font-medium">
        {isPending ? t("Auth.registering") : t("Auth.register")}
      </button>

      <button
        type="button"
        onClick={onSwitch}
        className="border py-3 rounded-lg font-medium text-lg"
      >
        {t("Auth.alreadyHaveAccount")}
      </button>
    </form>
  );
}