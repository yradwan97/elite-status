import i18n from "@/i18n";
import { store } from "@/store";
import { setLanguage } from "@/store/slices/language-slice";

export function initLanguage() {
  const savedLanguage = localStorage.getItem("language") as "en" | "ar" | null;
  if (!savedLanguage) return;
  i18n.changeLanguage(savedLanguage);
  store.dispatch(setLanguage(savedLanguage));
}