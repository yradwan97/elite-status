import { StarIcon } from '@/components/icons/StarIcon';
import { Heart, MapPin, Users, CircleDollarSign } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PropertyCardProps {
    id: number;
    title: string;
    location: string;
    price: number;
    originalPrice?: number | null;
    discountPercentage?: number | null;
    discountValidFrom?: string | null;   // YYYY-MM-DD
    discountValidTo?: string | null;
    rating: number;
    isBestOffer?: boolean;
    image: string;
    capacity: number;
    onFavorite?: (id: number) => void;
    isFavorited?: boolean;
}

export function PropertyCard({
    id,
    title,
    location,
    price,
    originalPrice = null,
    discountPercentage = null,
    discountValidFrom = null,
    discountValidTo = null,
    rating,
    isBestOffer = false,
    image,
    capacity,
    onFavorite,
    isFavorited = false,
}: PropertyCardProps) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';

    // Check if discount is currently active
    const isDiscountActive = () => {
        if (!discountValidFrom || !discountValidTo) return false;

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of day

        const fromDate = new Date(discountValidFrom);
        const toDate = new Date(discountValidTo);

        return today >= fromDate && today <= toDate;
    };

    const hasActiveDiscount = isDiscountActive() && !!originalPrice && !!discountPercentage;

    return (
        <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
            {/* Image Container */}
            <div className="relative h-56 overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                    <div className="flex items-center gap-1 bg-black/70 text-white text-xs font-medium px-3 py-1 rounded-md">
                        <StarIcon size={16} color="#FACC15" />
                        {rating.toFixed(1)}
                    </div>
                    {isBestOffer && (
                        <div className="bg-navy text-white text-xs font-semibold px-3 py-1 rounded-md">
                            {t('Dashboard.bestOffer')}
                        </div>
                    )}
                </div>

                {/* Favorite Button */}
                <button
                    onClick={() => onFavorite?.(id)}
                    className="absolute top-4 right-4 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                >
                    <Heart
                        className={`w-5 h-5 transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                    />
                </button>
            </div>

            {/* Content */}
            <div className={`p-5 ${isArabic ? 'text-right' : 'text-left'}`}>
                <h3 className="font-semibold text-lg leading-tight text-navy mb-3 line-clamp-2">
                    {title}
                </h3>

                {/* Location */}
                <div className={`flex items-center gap-1.5 text-gray-600 text-sm mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span>{location}</span>
                </div>

                {/* Price Section with Discount Logic */}
                <div className={`mb-4 ${isArabic ? 'text-right flex-row-reverse' : 'text-left'}`}>
                    <div className="flex items-center gap-1 mb-1">
                        <CircleDollarSign className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="text-gray-600">{t('Dashboard.startFrom')}</span>
                        {hasActiveDiscount ? (
                            // === DISCOUNT ACTIVE ===
                            <div>
                                
                                <div className="flex flex-row items-baseline gap-2 ms-2">
                                    <span className="text-xl font-bold text-amber-500">
                                        {price}
                                    </span>
                                    <span className="text-lg font-medium text-gray-400 line-through">
                                        {originalPrice}
                                    </span>
                                    <span className="text-base text-gray-500">KWD</span>
                                    <p className="text-xs text-gray-400 mt-1">
                                        / {t('Dashboard.day')}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            // === NO DISCOUNT ===
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-amber-500">
                                    {price}
                                </span>
                                <span className="text-base text-gray-500">KWD</span>
                                <p className="text-xs text-gray-400 mt-1">
                                    / {t('Dashboard.day')}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-1">
                        
                    </div>
                </div>

                {/* Capacity */}
                <div className={`flex items-center gap-1.5 text-gray-600 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <Users className="w-4 h-4 shrink-0" />
                    <span>{capacity} {t('Dashboard.person')}</span>
                </div>
            </div>
        </div>
    );
}