// components/auth/AuthModal.tsx
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignUpForm";
import authBg from "@/assets/auth-bg.png";
import { useTranslation } from "react-i18next";
import i18next from "@/i18n";
import { OptimizedImage } from "@/components/shared/OptimizedImage";
import { ForgetPasswordModal } from "./ForgetPasswordModal";

export type AuthMode = "login" | "signup" | "forget";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AuthModal({ open, onOpenChange }: Props) {
  const [mode, setMode] = useState<AuthMode>("login");
  const {t} = useTranslation();
  const isArabic = i18next.language === "ar";

  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="w-225! max-w-[95vw]! p-0 overflow-hidden rounded-2xl">
        <div className="grid grid-cols-2 ">
          
          {/* LEFT IMAGE */}
          <div className={`hidden md:flex relative ${isArabic ? "order-last" : ""}`}>
            <OptimizedImage
              src={authBg}
              alt="Auth background image"
              className="h-full w-full object-cover"
            />
            <div className={`absolute bottom-6 ${isArabic ? "right-6 text-end" : "left-6 text-start"} text-white text-3xl font-semibold`}>
              {t("Auth.welcome-1")} <br /> {t("Auth.welcome-2")}
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="p-8 col-span-2 md:col-span-1 w-full max-h-[80dvh] overflow-auto">
            {mode === "login" ? (
              <LoginForm setMode={setMode} onClose={() => onOpenChange(false)} />
            ) : mode === 'signup' ? (
              <SignupForm onSwitch={() => setMode("login")} />
            ) : (
              <ForgetPasswordModal onSwitch={() => setMode("login")} onClose={() => onOpenChange(false)} />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}