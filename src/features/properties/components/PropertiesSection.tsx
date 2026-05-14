import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, ChevronDown, ChevronRight, CircleX, Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PropertyCard } from '@/features/properties/components/property-card';
import { useProperties } from '@/features/properties/api/hooks/useProperties';
import i18next from 'i18next';
import { useFacilities } from '../api/hooks/useFacilities';
import Pagination from '@/components/shared/Pagination';
import { PageTitle } from '@/components/shared/PageTitle';
import { OptimizedImage } from '@/components/shared/OptimizedImage';
import Counter from '@/components/shared/Counter';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAds } from '../api/hooks/useAds';
import { DatePicker } from '@/components/shared/DatePicker';
import { PropertyCardSkeleton } from './property-card-skeleton';


export default function PropertiesSection() {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const [adPanelOpen, setAdPanelOpen] = useState(false);
    const [adCarouselIndex, setAdCarouselIndex] = useState(0);



    const {
        properties,
        totalPages,
        currentPage,
        isLoading,
        error,
        filters,
        setFilters,
        resetFilters,
        setPage,
    } = useProperties();

    const { facilities, isLoading: isFacilitiesLoading } = useFacilities();
    const { ads } = useAds()

    const [closedAds, setClosedAds] = useState<string[]>(() => {
        try {
            return JSON.parse(sessionStorage.getItem('closedAds') || '[]');
        } catch {
            return [];
        }
    });

    useEffect(() => {
        if (!ads || ads.length === 0) return;
        const visibleAds = ads.filter(ad => !closedAds.includes(ad._id));
        if (visibleAds.length === 0) return;

        const timer = setTimeout(() => setAdPanelOpen(true), 5000);
        return () => clearTimeout(timer);
    }, [ads]);

    const closeAdPanel = () => {
        if (!ads) return;
        const allIds = ads.map(ad => ad._id);
        const updated = [...new Set([...closedAds, ...allIds])];
        setClosedAds(updated);
        sessionStorage.setItem('closedAds', JSON.stringify(updated));
        setAdPanelOpen(false);
    };

    const closeAd = (id: string) => {
        const updated = [...closedAds, id];
        setClosedAds(updated);
        sessionStorage.setItem('closedAds', JSON.stringify(updated));
    };

    const location = useLocation()
    const navigate = useNavigate()
    const passedSearch = location.state?.params as {destination: string | undefined, noOfGuests: string | undefined, startDate: Date | undefined, endDate: Date | undefined }

    useEffect(() => {
        if (location.state) {
            navigate('.', { replace: true, state: null });
        }
    }, [navigate, location.state]);

    // Local draft state for filter panel (applied only on "Apply")
    const [draft, setDraft] = useState({
        guests: passedSearch?.noOfGuests
            ? Number(passedSearch.noOfGuests)
            : (filters.guests ?? 0),

        bedrooms: filters.bedrooms ?? 0,
        bathrooms: filters.bathrooms ?? 0,
        lounges: filters.lounges ?? 0,
        startDate: passedSearch?.startDate ?? (filters.startDate ?? undefined),  // ← add
        endDate: passedSearch?.endDate ?? (filters.endDate ?? undefined),

        facilities: filters.facilities ?? [] as string[],

        search: passedSearch?.destination
            ? passedSearch.destination
            : (filters.search ?? undefined),
    });

    const [facilitiesOpen, setFacilitiesOpen] = useState(true);

    const handleApply = () => {
        setFilters({
            guests: draft.guests,
            bedrooms: draft.bedrooms,
            bathrooms: draft.bathrooms,
            lounges: draft.lounges,
            facilities: draft.facilities,
            search: draft.search,
            startDate: draft.startDate,
            endDate: draft.endDate,
            page: 1,
        });
    };

    useEffect(function readSearchParamsFromRoutingEvent() {
        if (passedSearch && (passedSearch.destination || passedSearch.noOfGuests || passedSearch.startDate || passedSearch.endDate)) {

            // eslint-disable-next-line react-hooks/set-state-in-effect
            setDraft(prev => ({
                ...prev,
                search: passedSearch.destination || prev.search,
                guests: passedSearch.noOfGuests ? Number(passedSearch.noOfGuests) : prev.guests,
                startDate: passedSearch.startDate,
                endDate: passedSearch.endDate
            }));

            handleApply();
        }
    }, []);

    const handleReset = () => {
        const empty = { guests: 0, bedrooms: 0, bathrooms: 0, lounges: 0, facilities: [], search: '', startDate: undefined, endDate: undefined };
        setDraft(empty);
        resetFilters();
    };

    const toggleFacility = (id: string) => {
        setDraft(prev => ({
            ...prev,
            facilities: prev.facilities.includes(id)
                ? prev.facilities.filter(f => f !== id)
                : [...prev.facilities, id],
        }));
    };

    return (
        <>
            <PageTitle titleKey='Properties.heading' />
            <main className={`min-h-screen bg-gray-50 ${isArabic ? 'font-arabic' : ''}`}>
                {/* ── Page heading + search ── */}
                <div className="bg-white border-b border-gray-100 min-w-sm">
                    <div className={`max-w-7xl flex flex-col justify-between mx-auto px-6 py-6 ${isArabic ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}>
                        {/* Breadcrumb */}
                        <div className={`flex flex-col gap-2 `}>
                            <nav className={`flex items-center w-full ${isArabic ? 'flex-row-reverse' : ''} gap-1 text-lg text-gray-500`}>
                                <button
                                    onClick={() => navigate("/")}
                                    className="hover:text-navy transition-colors"
                                >
                                    {t('Properties.nav.home')}
                                </button>

                                <ChevronRight className={cn("w-3 h-3", isArabic && "rotate-180")} />

                                <button
                                    onClick={() => navigate("/properties")}
                                    className="hover:text-navy transition-colors"
                                >
                                    {t('Properties.nav.chalet')}
                                </button>
                            </nav>
                            <h1 className={`text-2xl font-bold text-navy leading-tight ${isArabic ? 'text-end' : ''}`}>
                                {t('Properties.heading')}
                            </h1>
                        </div>

                        <div className="flex flex-col mt-4 sm:mt-0 sm:flex-row sm:items-center gap-4 justify-between">
                            {/* Search bar */}
                            <div className={`flex flex-col gap-2 w-full sm:w-auto sm:min-w-85 ${isArabic ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}>
                                <input
                                    value={draft.search}
                                    onChange={e => setDraft(prev => ({ ...prev, search: e.target.value }))}
                                    onKeyDown={e => e.key === 'Enter' && handleApply()}
                                    placeholder={t('Properties.searchPlaceholder')}
                                    className={`flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all ${isArabic ? 'text-right' : ''}`}
                                />
                                <button
                                    onClick={() => setMobileFilterOpen(true)}
                                    className="bg-white sm:hidden text-navy justify-center border border-navy px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-navy/90 hover:text-white transition-colors"
                                >
                                    <Filter className="w-4 h-4" />
                                    {t('Properties.moreFilters')}
                                </button>
                                <button
                                    onClick={handleApply}
                                    className="bg-navy text-white justify-center px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-navy/90 transition-colors"
                                >
                                    <Search className="w-4 h-4" />
                                    {t('Properties.search')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Body: sidebar + grid ── */}
                <div className={`max-w-7xl mx-auto px-6 py-8 flex gap-8 items-start ${isArabic ? 'flex-row-reverse' : ''}`}>

                    {/* ── Filter Sidebar ── */}
                    <aside className="w-56 shrink-0 sticky top-6 hidden sm:flex flex-col gap-6">
                        <div className="bg-white max-h-153.75 rounded-2xl shadow-sm border border-gray-100 p-5">
                            <div className={`flex items-center gap-2 mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                                <SlidersHorizontal className="w-4 h-4 text-navy" />
                                <h2 className="font-semibold text-navy text-sm">
                                    {t('Properties.filter.title')}
                                </h2>
                            </div>

                            {/* Counters */}
                            <Counter
                                label={t('Properties.filter.guests')}
                                value={draft.guests}
                                onChange={v => setDraft(p => ({ ...p, guests: v }))}
                            />
                            <Counter
                                label={t('Properties.filter.bedrooms')}
                                value={draft.bedrooms}
                                onChange={v => setDraft(p => ({ ...p, bedrooms: v }))}
                            />
                            <Counter
                                label={t('Properties.filter.bathrooms')}
                                value={draft.bathrooms}
                                onChange={v => setDraft(p => ({ ...p, bathrooms: v }))}
                            />
                            <Counter
                                label={t('Properties.filter.lounges')}
                                value={draft.lounges}
                                onChange={v => setDraft(p => ({ ...p, lounges: v }))}
                            />
                            <div className="mt-4">
                                <p className={`text-sm font-semibold text-navy mb-2 ${isArabic ? 'text-right' : ''}`}>
                                    {t('Properties.filter.dates')}
                                </p>
                                <DatePicker
                                    dateRange={{ from: draft.startDate, to: draft.endDate }}
                                    setDateRange={({ from, to }) => setDraft(p => ({ ...p, startDate: from, endDate: to }))}
                                    placeholder={t('Dashboard.selectDates')}
                                    isArabic={isArabic}
                                />
                            </div>

                            {/* Facilities */}
                            <div className="mt-4">
                                <button
                                    onClick={() => setFacilitiesOpen(o => !o)}
                                    className={`flex items-center justify-between w-full py-2 text-sm font-semibold text-navy ${isArabic ? 'flex-row-reverse' : ''}`}
                                >
                                    {t('Properties.filter.facilities')}
                                    <ChevronDown className={`w-4 h-4 transition-transform ${facilitiesOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {facilitiesOpen && (
                                    <div className="mt-2 space-y-2">
                                        {isFacilitiesLoading ? (
                                            Array.from({ length: 4 }).map((_, i) => (
                                                <div key={i} className="h-5 bg-gray-100 rounded animate-pulse" />
                                            ))
                                        ) : facilities?.length > 0 ? (
                                            facilities.map(fac => (
                                                <label
                                                    key={fac._id}
                                                    className={`flex items-center gap-2 cursor-pointer group ${isArabic ? 'flex-row-reverse' : ''}`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={draft.facilities.includes(fac._id)}
                                                        onChange={() => toggleFacility(fac._id)}
                                                        className="w-4 h-4 rounded border-gray-300 text-navy accent-navy"
                                                    />
                                                    <span className={`flex items-center gap-1.5 text-sm text-gray-600 group-hover:text-navy transition-colors ${isArabic ? 'flex-row-reverse' : ''}`}>
                                                        <OptimizedImage src={fac.icon!} alt="" className="w-4 h-4 object-contain" />
                                                        {i18next.language === 'ar' ? fac.titleAr : fac.titleEn}
                                                    </span>
                                                </label>
                                            ))
                                        ) : null}
                                    </div>
                                )}
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-2 mt-6">
                                <button
                                    onClick={handleReset}
                                    className="flex-1 py-2 text-sm font-semibold border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    {t('Properties.filter.reset')}
                                </button>
                                <button
                                    onClick={handleApply}
                                    className="flex-1 py-2 text-sm font-semibold bg-navy text-white rounded-xl hover:bg-navy/90 transition-colors"
                                >
                                    {t('Properties.filter.apply')}
                                </button>
                            </div>
                        </div>
                        {(ads && ads.length > 0) &&
                            <>
                                {ads?.filter(ad => !closedAds.includes(ad._id)).map((ad, index) => (
                                    <div key={ad._id} className='relative border-gray-500 border'>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); closeAd(ad._id) }}
                                            className='absolute top-4 flex text-white gap-1 right-4 cursor-pointer bg-gray-500 rounded-md p-1 z-10'
                                        >
                                            <span className='text-sm'>{t("General.closeAd")}</span>
                                            <CircleX className='size-5' />
                                        </button>
                                        <a href={ad.link} target='_blank'>
                                            <OptimizedImage src={ad.image} alt={`Ad image - ${index}`} className='h-116.25 w-73.75 object-contain' />
                                        </a>
                                    </div>
                                ))}
                            </>
                        }
                    </aside>

                    {/* ── Property Grid ── */}
                    <section className="flex-1 justify-center min-w-0" dir={isArabic ? 'rtl' : 'ltr'}>
                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl px-6 py-4 mb-6 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Grid */}
                        <div className='flex justify-center'>
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {isLoading
                                    ? Array.from({ length: 9 }).map((_, i) => <PropertyCardSkeleton key={i} />)
                                    : properties?.length > 0
                                        ? properties.map(property => (
                                            <PropertyCard
                                                key={property._id}
                                                property={property}
                                            />
                                        ))
                                        : (
                                            <div className="col-span-3 text-center py-20 text-gray-400">
                                                <p className="text-lg font-medium">{t('Properties.noResults')}</p>
                                                <p className="text-sm mt-1">{t('Properties.tryDifferent')}</p>
                                            </div>
                                        )
                                }
                            </div>
                        </div>

                        {/* Pagination */}
                        {!isLoading && (
                            <Pagination
                                current={currentPage}
                                total={totalPages}
                                onPageChange={setPage}
                            />
                        )}
                    </section>
                </div>
                {/* ── Mobile Filter Slide-over ── */}
                {mobileFilterOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-black/40 z-40 sm:hidden"
                            onClick={() => setMobileFilterOpen(false)}
                        />

                        {/* Panel */}
                        <div
                            className={`
                                fixed top-0 bottom-0 z-50 w-72 bg-white shadow-xl flex flex-col sm:hidden
                                transition-transform duration-300
                                ${isArabic ? 'right-0' : 'left-0'}
                            `}
                        >
                            {/* Header */}
                            <div className={`flex items-center justify-between px-5 py-4 border-b border-gray-100`}>
                                <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                                    <SlidersHorizontal className="w-4 h-4 text-navy" />
                                    {/* <h2 className="font-semibold text-navy text-sm">
                                        {t('Properties.filter.title')}
                                    </h2> */}
                                </div>
                                <button
                                    onClick={() => setMobileFilterOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <CircleX className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Scrollable content */}
                            <div className="flex-1 overflow-y-auto px-5 py-4">
                                <Counter
                                    label={t('Properties.filter.guests')}
                                    value={draft.guests}
                                    onChange={v => setDraft(p => ({ ...p, guests: v }))}
                                />
                                <Counter
                                    label={t('Properties.filter.bedrooms')}
                                    value={draft.bedrooms}
                                    onChange={v => setDraft(p => ({ ...p, bedrooms: v }))}
                                />
                                <Counter
                                    label={t('Properties.filter.bathrooms')}
                                    value={draft.bathrooms}
                                    onChange={v => setDraft(p => ({ ...p, bathrooms: v }))}
                                />
                                <Counter
                                    label={t('Properties.filter.lounges')}
                                    value={draft.lounges}
                                    onChange={v => setDraft(p => ({ ...p, lounges: v }))}
                                />

                                <div className="mt-4">
                                    <p className={`text-sm font-semibold text-navy mb-2 ${isArabic ? 'text-right' : ''}`}>
                                        {t('Properties.filter.dates')}
                                    </p>
                                    <DatePicker
                                        dateRange={{ from: draft.startDate, to: draft.endDate }}
                                        setDateRange={({ from, to }) => setDraft(p => ({ ...p, startDate: from, endDate: to }))}
                                        placeholder={t('Dashboard.selectDates')}
                                        isArabic={isArabic}
                                    />
                                </div>

                                {/* Facilities */}
                                <div className="mt-4">
                                    <button
                                        onClick={() => setFacilitiesOpen(o => !o)}
                                        className={`flex items-center justify-between w-full py-2 text-sm font-semibold text-navy ${isArabic ? 'flex-row-reverse' : ''}`}
                                    >
                                        {t('Properties.filter.facilities')}
                                        <ChevronDown className={`w-4 h-4 transition-transform ${facilitiesOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {facilitiesOpen && (
                                        <div className="mt-2 space-y-2">
                                            {isFacilitiesLoading ? (
                                                Array.from({ length: 4 }).map((_, i) => (
                                                    <div key={i} className="h-5 bg-gray-100 rounded animate-pulse" />
                                                ))
                                            ) : facilities?.length > 0 ? (
                                                facilities.map(fac => (
                                                    <label
                                                        key={fac._id}
                                                        className={`flex items-center gap-2 cursor-pointer group ${isArabic ? 'flex-row-reverse' : ''}`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={draft.facilities.includes(fac._id)}
                                                            onChange={() => toggleFacility(fac._id)}
                                                            className="w-4 h-4 rounded border-gray-300 text-navy accent-navy"
                                                        />
                                                        <span className={`flex items-center gap-1.5 text-sm text-gray-600 group-hover:text-navy transition-colors ${isArabic ? 'flex-row-reverse' : ''}`}>
                                                            <OptimizedImage src={fac.icon!} alt="" className="w-4 h-4 object-contain" />
                                                            {i18next.language === 'ar' ? fac.titleAr : fac.titleEn}
                                                        </span>
                                                    </label>
                                                ))
                                            ) : null}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Sticky footer buttons */}
                            <div className="px-5 py-4 border-t border-gray-100 flex gap-2">
                                <button
                                    onClick={() => {
                                        handleReset();
                                        setMobileFilterOpen(false);
                                    }}
                                    className="flex-1 py-2.5 text-sm font-semibold border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    {t('Properties.filter.reset')}
                                </button>
                                <button
                                    onClick={() => {
                                        handleApply();
                                        setMobileFilterOpen(false);
                                    }}
                                    className="flex-1 py-2.5 text-sm font-semibold bg-navy text-white rounded-xl hover:bg-navy/90 transition-colors"
                                >
                                    {t('Properties.filter.apply')}
                                </button>
                            </div>
                        </div>
                    </>
                )}
                {/* ── Mobile Ad Panel ── */}
                {(() => {
                    const visibleAds = ads?.filter(ad => !closedAds.includes(ad._id)) ?? [];
                    if (visibleAds.length === 0) return null;

                    return (
                        <>
                            {/* Backdrop */}
                            {adPanelOpen && (
                                <div
                                    className="fixed inset-0 bg-black/40 z-40 sm:hidden"
                                    onClick={closeAdPanel}
                                />
                            )}

                            {/* Panel */}
                            <div
                                className={`
                    fixed top-0 left-0 right-0 z-50 bg-white shadow-xl rounded-b-2xl sm:hidden
                    transition-transform duration-500 ease-in-out
                    ${adPanelOpen ? 'translate-y-0' : '-translate-y-full'}
                `}
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                                    <span className="text-sm font-semibold text-navy">
                                        {t("General.closeAd")}
                                    </span>
                                    <button
                                        onClick={closeAdPanel}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <CircleX className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Carousel */}
                                <div className="relative overflow-hidden">
                                    <div
                                        className="flex transition-transform duration-300 ease-in-out"
                                        style={{ transform: `translateX(${isArabic ? '' : '-'}${adCarouselIndex * 100}%)` }}
                                    >
                                        {visibleAds.map((ad, index) => (
                                            <div key={ad._id} className="w-full shrink-0">
                                                <a href={ad.link} target="_blank" rel="noreferrer">
                                                    <OptimizedImage
                                                        src={ad.image}
                                                        alt={`Ad ${index + 1}`}
                                                        className="w-full max-h-72 object-contain"
                                                    />
                                                </a>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Prev / Next */}
                                    {visibleAds.length > 1 && (
                                        <>
                                            <button
                                                onClick={() => setAdCarouselIndex(i => Math.max(0, i - 1))}
                                                disabled={adCarouselIndex === 0}
                                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-8 h-8 flex items-center justify-center disabled:opacity-30"
                                            >
                                                ‹
                                            </button>
                                            <button
                                                onClick={() => setAdCarouselIndex(i => Math.min(visibleAds.length - 1, i + 1))}
                                                disabled={adCarouselIndex === visibleAds.length - 1}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-8 h-8 flex items-center justify-center disabled:opacity-30"
                                            >
                                                ›
                                            </button>
                                        </>
                                    )}

                                    {/* Dots */}
                                    {visibleAds.length > 1 && (
                                        <div className="flex justify-center gap-1.5 py-3">
                                            {visibleAds.map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setAdCarouselIndex(i)}
                                                    className={`w-1.5 h-1.5 rounded-full transition-colors ${i === adCarouselIndex ? 'bg-navy' : 'bg-gray-300'}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    );
                })()}
            </main>
        </>
    );
}