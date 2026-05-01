export interface PricingPlan {
  key: 'WEEK_DAYS' | 'DAILY' | 'DAY_USE' | 'WEEK_END' | 'WHOLE_WEEK';
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
  startDate?: Date;
  endDate?: Date;
  acceptedTerms: boolean;
  services: ExtraService[];
  paymentMethod: string;
  paymentOption: "50" | "100";
}

export type Step = "pricing" | "calendar" | "services" | "confirmation";