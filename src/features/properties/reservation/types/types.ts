export interface PricingPlan {
  key: 'WEEK_DAYS' | 'DAILY' | 'DAY_USE' | 'WEEK_END' | 'WHOLE_WEEK_SUNDAY' | 'WHOLE_WEEK_THURSDAY' | 'EVENTS';
  labelKey: string;
  subtitleKey?: string;
  price: number | null;
  info?: string;
  checkin?: string
  checkout?: string
}

export interface Event {
  _id: string
  nameAr: string
  nameEn: string
  startDate: string
  endDate: string
  active: boolean
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
  usePlan: boolean,
  eventId?: string
}

export type Step = "pricing" | "calendar" | "services" | "confirmation";