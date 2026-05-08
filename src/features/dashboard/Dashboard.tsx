'use client';
import { PropertyCard } from '@/features/properties/components/property-card';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon, ArrowRightIcon, Search } from 'lucide-react';
import i18next from 'i18next';
import { PageTitle } from '@/components/shared/PageTitle';
import ServiceCard, { ServiceCardSkeleton } from "./components/service-card";
import PlanCard, { PlanCardSkeleton } from './components/plan-card';

import eliteHomepageBg from '@/assets/elite-homepage-bg.png';
import hero3 from '@/assets/hero-3.jpeg';
import hero2 from '@/assets/hero-2.jpeg';
import carouselLast from '@/assets/carousel-last.png';
import carouselCenter from '@/assets/carousel-center.png';
import carouselfirst from '@/assets/carousel-first.png';
import pattern from '@/assets/pattern.png';

import newsletterVector from '@/assets/newsletter-vector.png';
import { useProperties } from '../properties/api/hooks/useProperties';
import { PropertyCardSkeleton } from '../properties/components/property-card-skeleton';
import { OptimizedImage } from '@/components/shared/OptimizedImage';
import { useEffect, useRef, useState } from 'react';
import Counter from '@/components/shared/Counter';
import { DatePicker } from '@/components/shared/DatePicker';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOwnerServices } from './owner-services/api/hooks/useOwnerServices';
import { toast } from 'sonner';
import PhoneField from '@/components/shared/PhoneField';
import { useInfo } from '@/common/api/hooks/useInfo';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { usePlans } from '../profile/api/hooks/usePlans';

export default function Dashboard() {
  const { t } = useTranslation();
  const isArabic = i18next.language === 'ar';

  const { properties, isLoading } = useProperties()
  const { services, isLoading: servicesLoading } = useOwnerServices(1)
  const {plans, isLoading: isPlansLoading} = usePlans()
  const navigate = useNavigate()

  const [destination, setDestination] = useState("")
  const [noOfGuests, setNoOfGuests] = useState("")
  const [date, setDate] = useState("")
  const [phone, setPhone] = useState<string | undefined>(undefined)
  const { info } = useInfo()

  const location = useLocation();

  const handleSearch = () => {
    const searchData: Record<string, string> = {};

    if (destination?.trim()) {
      searchData.destination = destination.trim();
    }
    if (date) {
      searchData.date = date;
    }
    if (noOfGuests) {
      searchData.noOfGuests = noOfGuests;
    }
    navigate('/properties', { state: { params: searchData } })
  }

  const hasShownToast = useRef(false);

  useEffect(() => {
    if (
      location.state?.isLoginError &&
      !hasShownToast.current
    ) {
      hasShownToast.current = true;

      toast.error(t("General.pleaseLogin"));

      navigate(location.pathname, {
        replace: true,
        state: {},
      });
    }
  }, [location, navigate, t]);

  const slides = [eliteHomepageBg, hero2, hero3];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goTo = (index: number) => setCurrent(index);

  const handleWhatsappNewsletter = () => {
    if (!info?.whatsappContact || !phone) return
    const phoneNumber = info.whatsappTours;
    const message = t("Dashboard.Newsletter.whatsappMessage");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message + "\n" + "\n" + `${phone}`)}`;
    setPhone(undefined)
    window.open(whatsappUrl, "_blank");
  }

  return (
    <>
      <PageTitle titleKey="Dashboard.pageTitle" fallback="Elite Status" />
      <div className="min-h-screen mx-10.5 bg-white overflow-y-hidden">

        {/* Hero Section */}
        <div
          className="relative h-190.75 overflow-hidden bg-white"
          style={{ borderRadius: "20px" }}
        >
          {/* Slides */}
          {slides.map((img, i) => (
            <div
              key={i}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out"
              style={{
                backgroundImage: `url(${img})`,
                opacity: i === current ? 1 : 0,
                zIndex: i === current ? 1 : 0,
              }}
            />
          ))}

          {/* Content overlay */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 text-white">
            <h1 className="text-5xl text-navy md:text-6xl font-bold mb-4 tracking-tight">
              {t('Dashboard.escapeTheNoise')}
            </h1>

            <div className={`w-full max-w-4xl bg-white rounded-md md:rounded-full py-2 px-6 shadow-2xl`}>
              <div className={`flex gap-2 ${isArabic ? 'flex-col md:flex-row-reverse' : 'flex-col md:flex-row'}`}>
                <input
                  type="text"
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  placeholder={t('Dashboard.searchDestinations')}
                  className={`flex-1 px-6 py-4 rounded-2xl text-gray-900 focus:outline-none ${isArabic ? 'text-end' : ''}`}
                />
                <DatePicker
                  date={date}
                  setDate={setDate}
                  placeholder={t('Dashboard.selectDates')}
                  isArabic={isArabic}
                />
                <div className={`flex-1 ${isArabic ? 'text-end md:border-s-2 ps-3' : 'text-end md:border-e-2 pe-3'}`}>
                  <Counter
                    label={t('Dashboard.addGuests') || t('Properties.filter.guests')}
                    value={Number(noOfGuests) || 0}
                    onChange={(v) => setNoOfGuests(v.toString())}
                  />
                </div>
                <button
                  className="bg-turquoise flex flex-row w-full md:w-auto md:justify-center md:items-center text-white px-3 py-3 rounded-full font-medium transition"
                  onClick={handleSearch}
                >
                  <Search className="w-8 h-8" />
                  {/* <span className='text-center mx-auto block md:hidden'>Search</span> */}
                </button>
              </div>
            </div>
          </div>

          {/* Dot pagination */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-row items-center gap-6">
            {[0, 1, 2].map((i) => (
              <>
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`transition-all duration-300 flex flex-row ${i === current
                    ? "text-white" : "text-gray-400"
                    }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </button>
                {i < slides.length - 1 && <div className="flex h-px w-19.5 bg-gray-400" />}
              </>
            ))}
          </div>
        </div>

        {/* Best Deals Section */}
        <div className={`w-full bg-white`} >
          <div className="max-w-7xl  mx-auto px-6 py-16">
            <div className={`flex items-center justify-between mb-10 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <h2 className={`text-4xl font-bold text-navy ${isArabic ? 'text-right' : 'text-left'}`}>
                {t('Dashboard.bestDealsForRent')}
              </h2>
              <OptimizedImage src={pattern} alt="Best Deals Icon" className="hidden md:flex h-12 w-auto" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8" dir={isArabic ? 'rtl' : 'ltr'}>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)
              ) : properties.map((property) => (
                <PropertyCard
                  property={property}
                  key={property._id}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Nature Awaits Section */}
        <div className="relative bg-white py-32 overflow-hidden">

          {/* Watermark + Images */}
          <div className="relative flex items-center justify-center">

            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none bottom-[30em]">
              <p
                style={{ fontFamily: "'Maitree', serif", fontWeight: '600', letterSpacing: '0.3em' }}
                className="text-[8vw] font-maitree font-bold text-turquoise/10 uppercase whitespace-nowrap leading-none"
              >
                {t('Dashboard.eliteStatus')}
              </p>
            </div>

            {/* Three Images */}
            <div className={`flex flex-col lg:flex-row items-center justify-center gap-22.5 px-6 mt-4 ${isArabic ? 'sm:flex-row-reverse' : ''}`}>

              {/* Left */}
              <div className=" lg:w-98.25 h-105.75 rounded-2xl overflow-hidden shrink-0 shadow-sm">
                <OptimizedImage
                  src={carouselfirst}
                  alt=""
                  className="object-cover rounded-2xl"
                />
              </div>

              {/* Center — taller */}
              <div className="lg:w-98.25 h-131.75 rounded-2xl overflow-hidden shrink-0 shadow-sm z-10">
                <OptimizedImage
                  src={carouselCenter}
                  alt=""
                  className="object-cover rounded-2xl"
                />
              </div>

              {/* Right */}
              <div className="lg:w-98.25 h-105.75 rounded-2xl overflow-hidden shrink-0 shadow-sm">
                <OptimizedImage
                  src={carouselLast}
                  alt=""
                  className="object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>

          {/* Text + CTA */}
          <div className="flex flex-col text-center -translate-y-16.5 relative z-10 items-center gap-3 justify-center px-6 mt-10">
            <h2 style={{ fontFamily: "'Maitree', serif", fontWeight: '300' }} className="text-4xl md:text-5xl text-navy mb-2">
              {t('Dashboard.natureAwaits')}
            </h2>
            <p className="text-gray-500 text-base md:text-lg max-w-4xl mx-auto leading-relaxed">
              {t('Dashboard.natureAwaitsDescription')}
            </p>
            <a
              href="/properties"
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
        <section className="flex-1 min-w-0" dir={isArabic ? 'rtl' : 'ltr'}>
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className={`flex items-center justify-between mb-10`}>
              <h2 className={`text-4xl font-bold md:w-1/2 text-navy ${isArabic ? 'text-right' : 'text-left'}`}>
                {t('Dashboard.Pricing.title')}
              </h2>
              <OptimizedImage src={pattern} alt="pattern" className="hidden md:block h-12 w-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {isPlansLoading ? (
                Array.from({ length: 4 }).map((_, i) => <PlanCardSkeleton key={i} />)
              ) : 
              plans.map((plan) => (
                <PlanCard key={plan._id} plan={plan} />
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <div
          className="relative w-full mt-16"
          style={{ backgroundImage: `url(${newsletterVector})`, backgroundSize: 'cover', backgroundPosition: 'center top' }}
        >
          <div className="max-w-7xl mx-auto px-10 pt-14 pb-48">
            <div className={`flex flex-col md:flex-row items-center justify-between gap-10 ${isArabic ? 'md:flex-row-reverse' : 'md:flex-row'}`}>

              {/* Text — always on the "start" side */}
              <div className={`flex flex-col gap-3 `}>
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
              <div className={`md:bg-white/10 backdrop-blur-sm rounded-2xl p-2 md:p-3 flex flex-col w-auto md:w-auto items-center gap-3 ${isArabic ? ' md:flex-row-reverse' : ' md:flex-row'}`}>
                <PhoneField
                  value={phone}
                  onChange={(value) => setPhone(value)}
                // placeholder={t('Dashboard.Newsletter.emailPlaceholder')}
                // dir={isArabic ? 'rtl' : 'ltr'}
                // className={`bg-white rounded-xl px-5 py-3.5 text-gray-700 placeholder-gray-400 text-sm focus:outline-none  ${isArabic ? 'text-right' : 'text-left'}`}
                />
                <button disabled={!phone || !isValidPhoneNumber(phone)} onClick={handleWhatsappNewsletter} className="bg-navy text-white px-6 py-3.5 rounded-xl text-sm w-auto font-medium whitespace-nowrap hover:opacity-90 disabled:opacity-35 disabled:cursor-not-allowed transition-opacity shrink-0">
                  {t('Dashboard.Newsletter.subscribe')}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Service */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col items-center text-center gap-4 mb-12">
            <h2
              style={{ fontFamily: "'Maitree', serif", fontWeight: '600' }}
              className={`text-5xl md:text-6xl font-bold text-navy leading-tight ${isArabic ? 'text-right' : 'text-center'}`}
            >
              {t('Dashboard.Services.growTitle')}
            </h2>
            <p style={{ fontFamily: "'Maitree', serif", fontWeight: '500' }} className="text-gray-400 max-w-2xl">
              {t('Dashboard.Services.growSubtitle')}
            </p>
          </div>

          <section className="flex-1 min-w-0" dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {servicesLoading ? (
                Array.from({ length: 4 }).map((_, i) => <ServiceCardSkeleton key={i} />)
              ) : (
                services.map((service) => (
                  <ServiceCard key={service._id} service={service} />
                ))
              )}
            </div>
          </section>
        </div>
      </div >
    </>
  );
}