import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, ChevronDown, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PropertyCard } from '@/features/dashboard/components/property-card';
import { useProperties } from '@/features/properties/api/hooks/useProperties';
import i18next from 'i18next';
import { useFacilities } from '../api/hooks/useFacilities';
import Pagination from '@/components/shared/Pagination';
import { PageTitle } from '@/components/shared/PageTitle';
import { OptimizedImage } from '@/components/shared/OptimizedImage';
import Counter from '@/components/shared/Counter';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

// ── Counter control ───────────────────────────────────────────────────────────


// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
            <div className="h-56 bg-gray-200" />
            <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                <div className="h-5 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-1/4" />
            </div>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function PropertiesSection() {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';

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

    const location = useLocation()
    const navigate = useNavigate()
    const passedSearch = location.state?.params as Record<string, string> | undefined

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

        facilities: filters.facilities ?? [] as string[],

        search: passedSearch?.destination
            ? passedSearch.destination
            : (filters.search ?? ''),
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
            page: 1,
        });
    };

    useEffect(function readSearchParamsFromRoutingEvent() {
        if (passedSearch && (passedSearch.destination || passedSearch.noOfGuests || passedSearch.date)) {

            setDraft(prev => ({
                ...prev,
                search: passedSearch.destination || prev.search,
                guests: passedSearch.noOfGuests ? Number(passedSearch.noOfGuests) : prev.guests,
                // date: passedSearch.date || prev.date,
            }));

            handleApply();        // ← your apply function
        }
    }, []);

    const handleReset = () => {
        const empty = { guests: 0, bedrooms: 0, bathrooms: 0, lounges: 0, facilities: [], search: '' };
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
                <div className="bg-white border-b border-gray-100">
                    <div className={`max-w-7xl flex justify-between mx-auto px-6 py-6 ${isArabic ? 'flex-row-reverse' : ''}`}>
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
                            <h1 className="text-2xl font-bold text-navy leading-tight">
                                {t('Properties.heading')}
                            </h1>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                            {/* Search bar */}
                            <div className={`flex gap-2 w-full sm:w-auto sm:min-w-85 ${isArabic ? 'flex-row-reverse' : ''}`}>
                                <input
                                    value={draft.search}
                                    onChange={e => setDraft(prev => ({ ...prev, search: e.target.value }))}
                                    onKeyDown={e => e.key === 'Enter' && handleApply()}
                                    placeholder={t('Properties.searchPlaceholder')}
                                    className={`flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all ${isArabic ? 'text-right' : ''}`}
                                />
                                <button
                                    onClick={handleApply}
                                    className="bg-navy text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-navy/90 transition-colors"
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
                    <aside className="w-56 shrink-0 sticky top-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
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
                    </aside>

                    {/* ── Property Grid ── */}
                    <section className="flex-1 min-w-0" dir={isArabic ? 'rtl' : 'ltr'}>
                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl px-6 py-4 mb-6 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {isLoading
                                ? Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
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
            </main>
        </>
    );
}