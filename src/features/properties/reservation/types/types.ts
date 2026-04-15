export interface PricingPlan {
  key: string;
  labelKey: string;
  subtitleKey: string;
  price: number;
}

export interface ExtraService {
  _id: string;
  titleEn: string;
  titleAr: string;
  price: number;
}

export interface BookingState {
  planKey: string | null;
  planPrice: number;
  startDate: Date | null;
  endDate: Date | null;
  acceptedTerms: boolean;
  selectedServices: string[];
}

export type Step = "pricing" | "calendar" | "services" | "confirmation";