import { Property } from "@/features/properties/api/propertiesApi";
import { User } from "@/store/slices/authSlice";
import { clsx, type ClassValue } from "clsx"
import { t } from "i18next";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type FormatDateOptions = {
  date: string | Date;
  locale?: string;
  format?: 'short' | 'medium' | 'long' | 'full';
  includeTime?: boolean;
};

export function formatDate({
  date,
  locale = 'en',
  format = 'medium',
  includeTime = false,
}: FormatDateOptions): string {
  const resolvedLocale = locale === 'ar' ? 'ar-KW' : 'en-US';
  const parsedDate = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(parsedDate.getTime())) return '';

  const dateFormats: Record<string, Intl.DateTimeFormatOptions> = {
    short: { day: '2-digit', month: '2-digit', year: 'numeric' },
    medium: { day: 'numeric', month: 'short', year: 'numeric' },
    long: { day: 'numeric', month: 'long', year: 'numeric' },
    full: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
  };

  const options: Intl.DateTimeFormatOptions = {
    ...dateFormats[format],
    ...(includeTime && { hour: '2-digit', minute: '2-digit' }),
  };

  return new Intl.DateTimeFormat(resolvedLocale, options).format(parsedDate);
}

export const checkLoggedIn = (user: User | null): boolean => {
  if (!user) {
    toast.error(t("General.pleaseLogin"))
    return false
  } else {
    return true
  }
}

export const hasOffer = (property: Property): boolean => {
  const { start, end } = normalizeOfferDates(property.offerStartDate, property.offerEndDate)
  if (!start || !end) return false
  const now = new Date()
  return !!property.offer &&
    property.offerRate === "PERCENTAGE" &&
    property.offer > 0 &&
    !!property.offerRate &&
    !!property.offerStartDate &&
    !!property.offerEndDate &&
    now >= start
    && now <= end
}

const normalizeOfferDates = (startDate: string | null, endDate: string | null) => {
  if (!startDate || !endDate) return { start: null, end: null };

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Set start date to 00:00:00 (midnight)
  const normalizedStart = new Date(Date.UTC(
    start.getUTCFullYear(),
    start.getUTCMonth(),
    start.getUTCDate(),
    0, 0, 0, 0
  ));

  // Set end date to 23:59:59
  const normalizedEnd = new Date(Date.UTC(
    end.getUTCFullYear(),
    end.getUTCMonth(),
    end.getUTCDate(),
    23, 59, 59, 999
  ));

  return { start: normalizedStart, end: normalizedEnd };
};

export const adjustPriceForOffer = (price: number, property: Property) => {
  if (!property.offer || property.offer === 0) return price;
  if (!property.offerStartDate || !property.offerEndDate) return price;

  const start = new Date(property.offerStartDate);
  const end = new Date(property.offerEndDate);
  const now = new Date()

  // Set start date to 00:00:00 (midnight)
  const normalizedStart = new Date(Date.UTC(
    start.getUTCFullYear(),
    start.getUTCMonth(),
    start.getUTCDate(),
    0, 0, 0, 0
  ));

  // Set end date to 23:59:59
  const normalizedEnd = new Date(Date.UTC(
    end.getUTCFullYear(),
    end.getUTCMonth(),
    end.getUTCDate(),
    23, 59, 59, 999
  ));

  if (now < normalizedStart || now > normalizedEnd) return price;

  if (property.offerRate ==="PERCENTAGE" ) {
    if (property.offer > 1) {
      return (price * (1 - (property.offer / 100)))
    } else {
      return price * (1 - property.offer)
    }
  }

  return price
}

const PRICE_MAP: { key: keyof Property; period: string }[] = [
  { key: "dayUsePrice", period: "dayUse" },
  { key: "dailyPrice", period: "daily" },
  { key: "weekdaysPrice", period: "weekdays" },
  { key: "wholeWeekPrice", period: "weekly" },
  { key: "weekendPrice", period: "weekends" },
];

const KEY_PREFIX = "Properties.pricePeriods";

export const getFirstPriceAndPeriodKey = (property: Property) => {
  const match = PRICE_MAP.find(({ key }) => {
    const val = property[key] as number | undefined;
    return !!val && val > 0;
  });
  if (!match) return { price: 0, periodKey: "" };
  return { price: property[match.key] as number, periodKey: `${KEY_PREFIX}.${match.period}` };
};

export const getRemainingPricesAndPeriodKeys = (property: Property) => {
  const firstKey = PRICE_MAP.find(({ key }) => {
    const val = property[key] as number | undefined;
    return !!val && val > 0;
  })?.key;

  return PRICE_MAP
    .filter(({ key }) => key !== firstKey && !!(property[key] as number) && (property[key] as number) > 0)
    .map(({ key, period }) => ({ price: property[key] as number, periodKey: `${KEY_PREFIX}.${period}` }));
};

export const isValidUrl = (url: string | undefined | null): boolean => {
  if (!url || typeof url !== "string" || url.trim() === "") return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

export const formatTimeTo12Hour = (language: string, time?: string): string => {
  if (!time) return "";

  const [hours, minutes] = time.split(":").map(Number);

  const period = hours >= 12 ? (language === "ar" ? "مساء" : "PM") : (language === "ar" ? "صباحا" : "AM");
  const formattedHours = hours % 12 || 12;

  return `${formattedHours}:${minutes
    .toString()
    .padStart(2, "0")} ${period}`;
};