import { StarIcon } from '@/components/icons/StarIcon';
import { Property } from '@/features/properties/api/propertiesApi';
import { Heart, MapPin, Users, CircleDollarSign, Info } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';

interface PropertyCardProps {
    property: Property;
    isFavorited?: boolean;
}

export function PropertyCard({ property, isFavorited = false }: PropertyCardProps) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';

    if (!property) return

    const title = isArabic ? property.titleAr : property.titleEn;
    const image = property.images[0] ?? '';
    const price = property.dailyPrice;

    const priceRows = [
        { label: t('Dashboard.weekdays', 'Weekdays'), value: property.weekdaysPrice },
        { label: t('Dashboard.weekend', 'Weekend'), value: property.weekendPrice },
        { label: t('Dashboard.wholeWeek', 'Whole Week'), value: property.wholeWeekPrice },
        { label: t('Dashboard.dayUse', 'Day Use'), value: property.dayUsePrice },
    ];

    return (
        <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
            {/* Image */}
            <div className="relative h-56 overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    crossOrigin={''}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />

                {/* Rating badge */}
                <div className="absolute top-4 left-4 flex gap-2">
                    <div className="flex items-center gap-1 bg-black/70 text-white text-xs font-medium px-3 py-1 rounded-md">
                        <StarIcon size={16} color="#FACC15" />
                        {/* rating not in API yet — placeholder */}
                        5.0
                    </div>
                </div>

                {/* Favorite */}
                <button
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
                    <span>{property.address}</span>
                </div>

                {/* Price — dailyPrice is the display price */}
                <div className={`mb-4 ${isArabic ? 'text-right' : 'text-left'}`}>
                    <div className={`flex items-center gap-1 mb-1 ${isArabic ? 'flex-row-reverse' : ''}`}>
                        <CircleDollarSign className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="text-gray-600 text-lg">{t('Dashboard.startFrom')}</span>
                        <div className={`flex items-baseline gap-1 ms-1 ${isArabic ? 'flex-row-reverse' : ''}`}>
                            <Trans
                                i18nKey="Properties.dailyPrice"
                                values={{ price }}
                                components={{
                                    value: <span className="text-3xl font-bold text-amber-500" />,
                                    currency: <span className="text-lg text-gray-500" />,
                                    divider: <span className="text-lg text-gray-400" />,
                                    day: <span className="text-lg text-gray-400" />,
                                }}
                            >
                                <span className="text-3xl font-bold text-amber-500" />
                            </Trans>
                        </div>
                        <HoverCard openDelay={100} closeDelay={100}>
                            <HoverCardTrigger asChild>
                                <button className="ms-1 text-gray-400 hover:text-navy transition-colors">
                                    <Info className="w-3.5 h-3.5" />
                                </button>
                            </HoverCardTrigger>
                            <HoverCardContent
                                side="top"
                                align={'end'}
                                className="w-52 p-3"
                            >
                                <p className="text-xs text-center font-semibold text-navy mb-2">
                                    {t('Properties.priceBreakdown', 'Price Breakdown')}
                                </p>
                                <div className="space-y-1.5">
                                    {priceRows.map(({ label, value }) => (
                                        <div key={label} className={`flex ${isArabic ? 'flex-row-reverse' : ''} items-center justify-between`}>
                                            <span className="text-xs text-gray-500">{label}</span>
                                            <span className="text-xs font-semibold text-amber-500">
                                                {value} KWD
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                    </div>
                </div>

                {/* Capacity */}
                <div className={`flex items-center gap-1.5 text-gray-600 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <Users className="w-4 h-4 shrink-0" />
                    <span>{property.guests} {t('Dashboard.person')}</span>
                </div>
            </div>
        </div>
    );
}