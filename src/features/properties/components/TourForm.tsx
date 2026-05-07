import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { MessageCircle, User, Mail } from "lucide-react";
import type { TFunction } from "i18next";
import { isValidPhoneNumber } from "react-phone-number-input";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import InputField from "@/components/shared/InputField"; // adjust path as needed
import PhoneField from "@/components/shared/PhoneField"; // adjust path as needed
import i18next from "i18next";

// ── Schema factory (with translated error messages) ───────────────────────────

const getTourSchema = (t: TFunction) =>
    z.object({
        name: z.string().min(1, { message: t("Properties.Details.tour.validation.name") }),
        email: z
            .string()
            .min(1, { message: t("Properties.Details.tour.validation.email") })
            .email({ message: t("Properties.Details.tour.validation.validEmail") }),
        phone: z
            .string()
            .min(1, { message: t("Properties.Details.tour.validation.phone") })
            .refine(isValidPhoneNumber, { message: t("Properties.Details.tour.validation.validPhone") }),
        message: z.string().min(5, { message: t("Properties.Details.tour.validation.message") }),
    });

// Inferred from the schema factory — no dummy schema needed, no ESLint warnings
export type TourFormValues = z.infer<ReturnType<typeof getTourSchema>>;

// ── Props ─────────────────────────────────────────────────────────────────────

interface TourFormProps {
    onSubmit: (values: TourFormValues) => void;
    onWhatsapp: () => void;
    isSubmitting?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function TourForm({ onSubmit, onWhatsapp, isSubmitting = false }: TourFormProps) {
    const { t } = useTranslation();
    const isRTL = i18next.language === "ar"

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<TourFormValues>({
        resolver: zodResolver(getTourSchema(t)),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            message: "",
        },
    });

    const handleFormSubmit = (values: TourFormValues) => {
        onSubmit(values);
        reset();
    };

    return (
        <div className="border border-gray-200 rounded-2xl p-5">
            <h3 className="font-bold text-navy text-base mb-4">
                {t("Properties.Details.tour.title")}
            </h3>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">

                {/* Name */}
                <div>
                    <Label className="text-sm text-gray-500 mb-1 block">
                        {t("Properties.Details.tour.name")}
                    </Label>
                    <InputField
                        register={register}
                        name="name"
                        icon={User}
                        placeholder={t("Properties.Details.tour.namePlaceholder")}
                        error={errors.name?.message}
                    />
                </div>

                {/* Email */}
                <div>
                    <Label className="text-sm text-gray-500 mb-1 block">
                        {t("Properties.Details.tour.email")}
                    </Label>
                    <InputField
                        register={register}
                        name="email"
                        type="email"
                        icon={Mail}
                        placeholder={t("Properties.Details.tour.emailPlaceholder")}
                        error={errors.email?.message}
                    />
                </div>

                {/* Phone */}
                <div>
                    <Label className="text-sm text-gray-500 mb-1 block">
                        {t("Properties.Details.tour.phone")}
                    </Label>
                    <Controller
                        control={control}
                        name="phone"
                        render={({ field }) => (
                            <PhoneField
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                    {errors.phone?.message && (
                        <p className={`text-red-500 text-sm mt-1 ${isRTL ? "text-right" : ""}`}>{errors.phone.message}</p>
                    )}
                </div>

                {/* Message (optional — no InputField since it's a textarea) */}
                <div>
                    <Label className="text-sm text-gray-500 mb-1 block">
                        {t("Properties.Details.tour.message")}
                    </Label>
                    <Textarea
                        {...register("message")}
                        placeholder={t("Properties.Details.tour.messagePlaceholder")}
                        className="rounded-xl border-gray-200 text-sm placeholder:text-gray-300 resize-none min-h-25"
                    />
                    {errors.message?.message && (
                        <p className={`text-red-500 text-sm mt-1 ${isRTL ? "text-right" : ""}`}>{errors.message.message}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-navy hover:bg-[#243760] text-white rounded-xl h-11 font-semibold disabled:opacity-60"
                >
                    {t("Properties.Details.tour.submit")}
                </Button>
            </form>

            <div className="flex items-center gap-2 mt-3">
                <Separator className="flex-1" />
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                    {t("Properties.Details.tour.or")}
                </span>
                <Separator className="flex-1" />
            </div>

            <Button
                type="button"
                className="w-full mt-3 bg-[#25D366] hover:bg-[#1db954] text-white rounded-xl h-11 font-semibold gap-2"
                onClick={onWhatsapp}
            >
                <MessageCircle className="w-4 h-4" />
                {t("Properties.Details.tour.whatsapp")}
            </Button>
        </div>
    );
}