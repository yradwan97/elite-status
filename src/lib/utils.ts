import { clsx, type ClassValue } from "clsx"
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
  const resolvedLocale = locale === 'ar' ? 'ar-KW' : 'en-GB';
  const parsedDate = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(parsedDate.getTime())) return '';

  const dateFormats: Record<string, Intl.DateTimeFormatOptions> = {
    short:  { day: '2-digit', month: '2-digit', year: 'numeric' },
    medium: { day: 'numeric', month: 'short',   year: 'numeric' },
    long:   { day: 'numeric', month: 'long',    year: 'numeric' },
    full:   { weekday: 'long', day: 'numeric',  month: 'long', year: 'numeric' },
  };

  const options: Intl.DateTimeFormatOptions = {
    ...dateFormats[format],
    ...(includeTime && { hour: '2-digit', minute: '2-digit' }),
  };

  return new Intl.DateTimeFormat(resolvedLocale, options).format(parsedDate);
}