import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOwnerServices } from './api/hooks/useOwnerServices';
import ServiceCard, { ServiceCardSkeleton } from '../components/service-card';
import Pagination from '@/components/shared/Pagination';
import { PageTitle } from '@/components/shared/PageTitle';
import { useDebounce } from '@/common/api/hooks/useDebounce';

export default function OwnerServices() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce the search term
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Fetch services using debounced value
  const { services, isLoading, error, pages } = useOwnerServices(page, debouncedSearch, 12);

  // Reset to first page when debounced search changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [debouncedSearch]);

  return (
    <>
      <PageTitle titleKey={t('OwnerServices.heading')} />

      <main className="pb-12">
        {/* Header Section */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 ${isArabic ? 'md:flex-row-reverse' : ''}`}>
              <div>
                <h1 className="text-4xl font-bold text-navy tracking-tight">
                  {t('OwnerServices.heading')}
                </h1>
              </div>

              {/* Search Bar */}
              <div className="flex w-full md:w-auto">
                <div className="relative flex-1 md:w-96">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('OwnerServices.searchPlaceholder')}
                    className={cn(
                      "w-full border border-gray-200 rounded-2xl py-3.5 pl-5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all",
                      isArabic && "text-right pr-5 pl-12"
                    )}
                  />
                  <Search className={cn(
                    "absolute top-4 w-5 h-5 text-gray-400",
                    isArabic ? "left-5" : "right-5"
                  )} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="max-w-7xl mx-auto px-6 pt-10">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-8">
              {error}
            </div>
          )}

          <section className="flex-1 min-w-0" dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <ServiceCardSkeleton key={i} />
                  ))
                : services && services.length > 0
                ? services.map((service) => (
                    <ServiceCard
                      key={service._id}
                      service={service}
                    />
                  ))
                : (
                  <div className="col-span-full text-center py-20">
                    <p className="text-xl text-gray-500">
                      {t('OwnerServices.noResults')}
                    </p>
                  </div>
                )}
            </div>
          </section>
        </div>
      </main>

      {/* Pagination */}
      {!isLoading && services && services.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 mt-8">
          <Pagination 
            current={page} 
            total={pages ?? 1} 
            onPageChange={setPage} 
          />
        </div>
      )}
    </>
  );
}