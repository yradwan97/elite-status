'use client';

import { useState } from 'react';
import { PropertyCard } from '@/features/dashboard/components/property-card';
import { useTranslation } from 'react-i18next';
import eliteHomepageBg from '@/assets/elite-homepage-bg.png';
import { ArrowLeftIcon, ArrowRightIcon, Search } from 'lucide-react';
import i18next from 'i18next';
import { PageTitle } from '@/components/shared/PageTitle';
import ServiceCard, { Service } from "./components/service-card";
import PlanCard, { Plan } from './components/plan-card';

import carouselLast from '@/assets/carousel-last.png';
import carouselCenter from '@/assets/carousel-center.png';
import carouselfirst from '@/assets/carousel-first.png';
import pattern from '@/assets/pattern.png';
import silverPlanIcon from '@/assets/silver-plan-icon.png';
import goldPlanIcon from '@/assets/gold-plan-icon.png';
import platinumPlanIcon from '@/assets/platinum-plan-icon.png';
import diamondPlanIcon from '@/assets/diamond-plan-icon.png';
import newsletterVector from '@/assets/newsletter-vector.png';
import poolIcon from '@/assets/pool-icon.png'
import acIcon from '@/assets/ac-icon.png'
import laundryIcon from '@/assets/laundry-icon.png'
import gardenIcon from '@/assets/garden-icon.png'

const mockProperties = [
  {
    id: 1,
    title: "Chalet In Khiran - Sea View",
    location: "Raw 3, Khiran, Kuwait",
    price: 80,
    originalPrice: 100,
    discountPercentage: 20,
    discountValidFrom: "2026-04-01",
    discountValidTo: "2026-04-30",
    rating: 4.6,
    isBestOffer: true,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
    capacity: 10,
  },
  {
    id: 2,
    title: "Luxury Chalet In Khiran - Sea View",
    location: "Raw 3, Khiran, Kuwait",
    price: 100,
    originalPrice: null,
    discountPercentage: null,
    discountValidFrom: null,
    discountValidTo: null,
    rating: 4.8,
    isBestOffer: false,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
    capacity: 12,
  },
  {
    id: 3,
    title: "Beachfront Chalet In Khiran",
    location: "Raw 3, Khiran, Kuwait",
    price: 95,
    originalPrice: 120,
    discountPercentage: 21,
    discountValidFrom: "2026-04-10",
    discountValidTo: "2026-04-25",
    rating: 4.5,
    isBestOffer: true,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    capacity: 8,
  },
  {
    id: 4,
    title: "Modern Chalet With Private Pool",
    location: "Raw 3, Khiran, Kuwait",
    price: 120,
    originalPrice: null,
    discountPercentage: null,
    discountValidFrom: null,
    discountValidTo: null,
    rating: 4.9,
    isBestOffer: false,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a9c?w=800",
    capacity: 10,
  },
  {
    id: 5,
    title: "Cozy Sea View Chalet",
    location: "Raw 3, Khiran, Kuwait",
    price: 75,
    originalPrice: 90,
    discountPercentage: 17,
    discountValidFrom: "2026-04-05",
    discountValidTo: "2026-04-20",
    rating: 4.3,
    isBestOffer: false,
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
    capacity: 6,
  },
  {
    id: 6,
    title: "Premium Waterfront Chalet",
    location: "Raw 3, Khiran, Kuwait",
    price: 110,
    originalPrice: null,
    discountPercentage: null,
    discountValidFrom: null,
    discountValidTo: null,
    rating: 4.7,
    isBestOffer: true,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    capacity: 14,
  },
];

const mockPlans: Plan[] = [
  {
    key: "silver",
    name: "Silver Plan",
    price: 25,
    tagline: "Simple Stay, Smart Choice.",
    icon: silverPlanIcon,
    features: [
      { label: "5% discount on any booking for 6 months from the date of subscription", included: true },
      { label: "Pay 50% of the insurance value for any booking within a 6-month period", included: true },
      { label: "Enter a prize draw that takes place every 6 months", included: true },
      { label: "--", included: false },
      { label: "--", included: false },
      { label: "--", included: false },
    ],
  },
  {
    key: "gold",
    name: "Gold Plan",
    price: 50,
    tagline: "More comfort, more style.",
    badge: { label: "Best ROI", className: "bg-amber-600 text-amber-50" },
    icon: goldPlanIcon,
    features: [
      { label: "5% discount on any booking for 6 months from the date of subscription", included: true },
      { label: "Pay 50% of the insurance value for any booking within a 6-month period", included: true },
      { label: "Enter a prize draw that takes place every 6 months", included: true },
      { label: "Enter a prize draw that takes place every 6 months", included: true },
      { label: "--", included: false },
      { label: "--", included: false },
    ],
  },
  {
    key: "platinum",
    name: "Platinum Plan",
    price: 100,
    tagline: "Luxury without limits.",
    icon: platinumPlanIcon,
    badge: { label: "Most Popular", className: "bg-rose-600 text-rose-50" },
    featured: true,
    features: [
      { label: "5% discount on any booking for 6 months from the date of subscription", included: true },
      { label: "Pay 50% of the insurance value for any booking within a 6-month period", included: true },
      { label: "Enter a prize draw that takes place every 6 months", included: true },
      { label: "Enter a prize draw that takes place every 6 months", included: true },
      { label: "Enter a prize draw that takes place every 6 months", included: true },
      { label: "--", included: false },
    ],
  },
  {
    key: "diamond",
    name: "Diamond Plan",
    price: 200,
    tagline: "Stay productive, stay ahead.",
    icon: diamondPlanIcon,
    badge: { label: "Enterprise", className: "bg-teal-600 text-teal-50" },
    features: [
      { label: "5% discount on any booking for 6 months from the date of subscription", included: true },
      { label: "Pay 50% of the insurance value for any booking within a 6-month period", included: true },
      { label: "Enter a prize draw that takes place every 6 months", included: true },
      { label: "Enter a prize draw that takes place every 6 months", included: true },
      { label: "Enter a prize draw that takes place every 6 months", included: true },
      { label: "Enter a prize draw that takes place every 6 months", included: true },
    ],
  },
];

const mockServices: Service[] = [
  {
    key: "ac",
    title: "Air Conditioning",
    description: "Stay cool and comfortable with fast, reliable AC repair and maintenance tailored for your chalet.",
    icon: acIcon,
    onBook: () => console.log("Book AC"),
  },
  {
    key: "pool",
    title: "Swimming Pool",
    description: "Crystal-clear water, always ready—professional pool care to keep your space fresh and inviting.",
    icon: poolIcon,
    onBook: () => console.log("Book Pool"),
  },
  {
    key: "laundry",
    title: "Laundry",
    description: "Impeccable cleaning and perfectly pressed linens—because every detail matters for a flawless stay.",
    icon: laundryIcon,
    onBook: () => console.log("Book Laundry"),
  },
  {
    key: "garden",
    title: "Garden",
    description: "Lush and well-kept outdoor spaces—professional garden care to keep your chalet looking its best.",
    icon: gardenIcon,
    onBook: () => console.log("Book Garden"),
  },
];

export default function Dashboard() {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState<number[]>([]);
  const isArabic = i18next.language === 'ar';

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  return (
    <>
      <PageTitle titleKey="Dashboard.pageTitle" fallback="Elite Status" />
      <div className="min-h-screen bg-gray-50">

        {/* Hero Section */}
        <div
          className="relative h-145 bg-cover bg-center"
          style={{ backgroundImage: `url(${eliteHomepageBg})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative h-full flex flex-col items-center justify-center text-center px-6 text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
              {t('Dashboard.escapeTheNoise')}
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-2xl">
              {t('Dashboard.findYourChalet')}
            </p>
            <div className="w-full max-w-4xl bg-white rounded-full py-2 px-6 shadow-2xl">
              <div className="flex flex-col md:flex-row gap-2">
                <input
                  type="text"
                  placeholder={t('Dashboard.searchDestinations')}
                  className="flex-1 px-6 py-4 rounded-2xl text-gray-900 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder={t('Dashboard.selectDates')}
                  className="flex-1 px-2 py-4 rounded-none text-gray-900 focus:outline-none border-s-2"
                />
                <input
                  type="text"
                  placeholder={t('Dashboard.addGuests')}
                  className="flex-1 px-2 py-4 rounded-none text-gray-900 focus:outline-none border-s-2"
                />
                <button className="bg-turquoise text-white px-3 py-3 rounded-full font-medium transition">
                  <Search className="w-8 h-8" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Best Deals Section */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className={`flex items-center justify-between mb-10 ${isArabic ? 'flex-row-reverse' : ''}`}>
            <h2 className={`text-4xl font-bold text-navy ${isArabic ? 'text-right' : 'text-left'}`}>
              {t('Dashboard.bestDealsForRent')}
            </h2>
            <img src={pattern} alt="Best Deals Icon" className="h-12 w-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {mockProperties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                title={property.title}
                location={property.location}
                price={property.price}
                discountPercentage={property.discountPercentage}
                originalPrice={property.originalPrice}
                discountValidFrom={property.discountValidFrom}
                discountValidTo={property.discountValidTo}
                rating={property.rating}
                isBestOffer={property.isBestOffer}
                image={property.image}
                capacity={property.capacity}
                isFavorited={favorites.includes(property.id)}
                onFavorite={toggleFavorite}
              />
            ))}
          </div>
        </div>

        {/* Nature Awaits Section */}
        <div className="bg-white py-20 overflow-hidden">

          {/* Watermark + Images */}
          <div className="relative flex items-center justify-center">

            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none bottom-[25em]">
              <p
                style={{ fontFamily: "'Maitree', serif", fontWeight: '600', letterSpacing: '0.3em' }}
                className="text-[9vw] font-maitree font-bold text-turquoise/10 uppercase whitespace-nowrap leading-none"
              >
                {t('Dashboard.eliteStatus')}
              </p>
            </div>

            {/* Three Images */}
            <div className={`relative flex items-center justify-center gap-10 px-6 mt-4 ${isArabic ? 'flex-row-reverse' : ''}`}>

              {/* Left */}
              <div className="w-72 h-80 rounded-2xl overflow-hidden shrink-0 shadow-sm">
                <img
                  src={carouselfirst}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Center — taller */}
              <div className="w-80 h-96 rounded-2xl overflow-hidden shrink-0 shadow-sm z-10">
                <img
                  src={carouselCenter}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right */}
              <div className="w-72 h-80 rounded-2xl overflow-hidden shrink-0 shadow-sm">
                <img
                  src={carouselLast}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Text + CTA */}
          <div className="flex flex-col text-center items-center gap-3 justify-center px-6 mt-10">
            <h2 style={{ fontFamily: "'Maitree', serif", fontWeight: '300' }} className="text-4xl md:text-5xl text-navy mb-2">
              {t('Dashboard.natureAwaits')}
            </h2>
            <p className="text-gray-500 text-base md:text-lg max-w-4xl mx-auto leading-relaxed">
              {t('Dashboard.natureAwaitsDescription')}
            </p>
            <a
              href="/property-search"
              className={`inline-flex items-center gap-3 text-navy rounded-full px-6 py-3 font-medium hover:bg-navy hover:text-white transition-colors mt-2 ${isArabic ? 'flex-row-reverse' : ''}`}
            >
              <span className="w-8 h-8 rounded-full border border-current flex items-center justify-center shrink-0">
                {isArabic
                  ? <ArrowLeftIcon className="w-4 h-4" />
                  : <ArrowRightIcon className="w-4 h-4" />
                }
              </span>
              {t('Dashboard.discoverMore')}
            </a>
          </div>
        </div>

        {/* Plans Section */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className={`flex items-center justify-between mb-10 ${isArabic ? 'flex-row-reverse' : ''}`}>
            <h2 className={`text-4xl font-bold w-1/2 text-navy ${isArabic ? 'text-right' : 'text-left'}`}>
              {t('Dashboard.Pricing.title')}
            </h2>
            <img src={pattern} alt="pattern" className="h-12 w-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {mockPlans.map((plan) => (
              <PlanCard key={plan.key} plan={plan} />
            ))}
          </div>
        </div>

        {/* Inner Circle / Newsletter Section */}
        <div
          className="relative w-full mt-16"
          style={{ backgroundImage: `url(${newsletterVector})`, backgroundSize: 'cover', backgroundPosition: 'center top' }}
        >
          <div className="max-w-7xl mx-auto px-10 pt-14 pb-48">
            <div className={`flex flex-col md:flex-row items-center justify-between gap-10 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>

              {/* Text — always on the "start" side */}
              <div className={`flex flex-col gap-3 ${isArabic ? 'items-end text-right order-2' : 'items-start text-left order-1'}`}>
                <h2
                  style={{ fontFamily: "'Maitree', serif", fontWeight: '600' }}
                  className="text-5xl md:text-6xl text-white leading-tight"
                >
                  {t('Dashboard.Newsletter.title')}
                </h2>
                <p className="text-white/70 text-base max-w-sm">
                  {t('Dashboard.Newsletter.subtitle')}
                </p>
              </div>

              {/* Email input — always on the "end" side */}
              <div className={`bg-white/10 backdrop-blur-sm rounded-2xl p-3 flex items-center gap-3 w-full md:w-auto ${isArabic ? 'order-1 flex-row-reverse' : 'order-2 flex-row'}`}>
                <input
                  type="email"
                  placeholder={t('Dashboard.Newsletter.emailPlaceholder')}
                  dir={isArabic ? 'rtl' : 'ltr'}
                  className={`bg-white rounded-xl px-5 py-3.5 text-gray-700 placeholder-gray-400 text-sm focus:outline-none w-72 ${isArabic ? 'text-right' : 'text-left'}`}
                />
                <button className="bg-navy text-white px-6 py-3.5 rounded-xl text-sm font-medium whitespace-nowrap hover:opacity-90 transition-opacity shrink-0">
                  {t('Dashboard.Newsletter.subscribe')}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Service */}
        {/* Owner Services Section */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col items-center text-center gap-4 mb-12">
            <h2
              style={{ fontFamily: "'Maitree', serif", fontWeight: '600' }}
              className={`text-5xl md:text-6xl font-bold text-navy leading-tight ${isArabic ? 'text-right' : 'text-center'}`}
            >
              {t('Dashboard.Services.growTitle') ?? <>Grow Your Rental<br />Income</>}
            </h2>
            <p className="text-gray-400 text-base max-w-2xl">
              {t('Dashboard.Services.growSubtitle') ?? 'Keep your chalet in perfect condition with our trusted repair and maintenance solutions'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockServices.map((service) => (
              <ServiceCard key={service.key} service={service} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}