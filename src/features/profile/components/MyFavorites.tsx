// src/features/account/pages/AccountFavourites.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFavouriteProperties } from '@/features/properties/api/hooks/useFavouriteProperties';
import { PropertyCard } from '@/features/properties/components/property-card';
import noFavourites from '@/assets/no-favourites.png';
import { OptimizedImage } from '@/components/shared/OptimizedImage';
import Pagination from '@/components/shared/Pagination';
import i18next from '@/i18n';

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

// ----------------------------------------------------------------------------

export default function AccountFavourites() {
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = React.useState(1);
  const { properties, pages, isLoading } = useFavouriteProperties(currentPage);
  const isArabic = i18next.language === 'ar';

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-8">
      <h1 className={`text-2xl ${isArabic ? 'text-right' : 'text-left'} font-semibold mb-8`}>{t("Account.Favourites.Title")}</h1>
      <section className="flex-1 min-w-0" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading
            ? Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
            : properties?.length > 0
              ? properties.map(property => (
                <PropertyCard
                  key={property._id}
                  isFromFavourites
                  property={property.item}
                />
              ))
              : (
                <div className="col-span-3 text-center py-20 text-gray-400">
                  <OptimizedImage src={noFavourites} alt="No favourites" className="mx-auto my-6 w-44 h-44 opacity-70 object-contain" />
                  <p className="text-lg font-medium">{t('Account.Favourites.NoFavourites')}</p>
                </div>
              )
          }
        </div>
      </section>
        <Pagination
          current={currentPage}
          total={pages || 1}
          onPageChange={setCurrentPage}
        />
      
    </div>
  );
}