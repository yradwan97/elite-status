import { StarIcon } from '@/components/icons/StarIcon';
import { Property } from '@/features/properties/api/propertiesApi';
import { Heart, MapPin, Users, CircleDollarSign } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import { useNavigate } from 'react-router-dom';
import { OptimizedImage } from '@/components/shared/OptimizedImage';
import useToggleFavourite from '../api/hooks/useToggleFavourite';
import { useLayoutEffect, useState } from 'react';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { useIsMobile } from '@/hooks/use-mobile';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { adjustPriceForOffer, getFirstPriceAndPeriodKey, getRemainingPricesAndPeriodKeys, hasOffer } from '@/lib/utils';

interface PropertyCardProps {
    property: Property;
    isFromFavourites?: boolean; // Optional prop to indicate if the card is rendered in the favorites section
}

export function PropertyCard({ property, isFromFavourites = false }: PropertyCardProps) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const user = useSelector((state: RootState) => state.auth.user);
    const navigate = useNavigate()

    const [isFavourite, setIsFavourite] = useState(isFromFavourites ? true : property?.isFavourite || false);
    const toggleFavourite = useToggleFavourite(property?._id || "");
    
    const isMobile = useIsMobile();
    const tagsCutoff = 1
    const visibleTags = property?.tags?.slice(0, tagsCutoff) ?? [];
    const extraTags = property?.tags?.slice(tagsCutoff) ?? [];



    useLayoutEffect(() => {
        if (property && !isFromFavourites) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsFavourite(!!property.isFavourite);
        }
    }, [property, isFromFavourites]);

    if (!property) return

    const title = isArabic ? property.titleAr : property.titleEn;
    const image = property.images[0] ?? '';
    
    const hasActiveOffer = hasOffer(property)

    const originalPrice = getFirstPriceAndPeriodKey(property);
    const discountedPrice = hasActiveOffer
        ? adjustPriceForOffer(originalPrice.price, property)
        : originalPrice.price;

    const priceRows = getRemainingPricesAndPeriodKeys(property).map(item => ({
        ...item,
        originalPrice: item.price,
        discountedPrice: hasActiveOffer
            ? adjustPriceForOffer(item.price, property)
            : item.price
    }));

    const handleGoToDetails = () => {
        const id = property._id
        if (!id) return

        navigate(`/properties/${id}`)
    }

    const handleFavouriteToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!user) return;
        e.stopPropagation();
        toggleFavourite.mutate(isFavourite, {
            onSuccess: () => {
                setIsFavourite(!isFavourite);
            }
        });
    };

    return (
        <div onClick={handleGoToDetails} className="group h-fit w-79.25 bg-white cursor-pointer rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all min-h-94.25 duration-300 border border-gray-100">
            {/* Image */}
            <div className="relative h-57.25 overflow-hidden flex">
                <OptimizedImage
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className={`absolute top-4 ${isArabic ? "right-4" : "left-4"} flex gap-2`}>
                    {/* Rating badge */}
                    <div className="flex gap-2">
                        {property?.rate && property.rate > 0 ? <div className="flex items-center gap-1 bg-black/70 text-white text-xs font-medium px-3 py-1 rounded-md">
                            <StarIcon size={16} color="#FACC15" />
                            {(property.rate && property.rate > 0) && property.rate.toFixed(1)}
                        </div> : null}
                    </div>
                    {visibleTags.length > 0 && <div className="flex gap-2">
                        {visibleTags.map((t) => (
                            <div
                                key={t._id}
                                className="flex items-center gap-1 bg-navy text-white text-sm font-medium px-3 py-1 rounded-md"
                            >
                                {isArabic ? t.titleAr : t.titleEn}
                            </div>
                        ))}

                        {extraTags.length > 0 && (
                            isMobile ? (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <div
                                            className="flex items-center gap-1 bg-navy/60 text-white text-sm font-medium px-3 py-1 rounded-full cursor-pointer select-none"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            +{extraTags.length}
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-2" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex flex-wrap flex-col gap-2">
                                            {extraTags.map((t) => (
                                                <div
                                                    key={t._id}
                                                    className="flex items-center gap-1 bg-navy text-white text-sm font-medium px-3 py-1 rounded-md"
                                                >
                                                    {isArabic ? t.titleAr : t.titleEn}
                                                </div>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            ) : (
                                <HoverCard>
                                    <HoverCardTrigger asChild>
                                        <div className="flex items-center gap-1 bg-navy/60 text-white text-sm font-medium px-3 py-1 rounded-full cursor-pointer select-none">
                                            +{extraTags.length}
                                        </div>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="w-auto p-2">
                                        <div className="flex flex-wrap gap-2">
                                            {extraTags.map((t) => (
                                                <div
                                                    key={t._id}
                                                    className="flex items-center gap-1 bg-navy text-white text-sm font-medium px-3 py-1 rounded-md"
                                                >
                                                    {isArabic ? t.titleAr : t.titleEn}
                                                </div>
                                            ))}
                                        </div>
                                    </HoverCardContent>
                                </HoverCard>
                            )
                        )}
                    </div>}
                </div>

                {/* Favorite */}
                {user && (
                    <button
                        className={`absolute top-4 ${isArabic ? "left-4" : "right-4"} cursor-pointer rounded-full bg-white p-1 flex items-center justify-center transition-all hover:scale-110 shadow-sm`}
                        onClick={handleFavouriteToggle}
                    >
                        <Heart className={`w-5 h-5 transition-colors ${isFavourite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                    </button>
                )}
            </div>

            {/* Content */}
            <div className={`h-auto px-2.5 py-5 ${isArabic ? 'text-right' : 'text-left'}`}>
                <h3 className="font-semibold text-lg leading-tight text-navy mb-2 line-clamp-2">
                    {title}
                </h3>

                {/* Location */}
                <div className={`flex items-center gap-1.25 text-gray-600 text-sm ${isArabic ? 'text-start' : 'text-end'}`}>
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span>{property.address}</span>
                </div>

                {/* Price — dailyPrice is the display price */}
                <div className={`flex mb-1 ${isArabic ? 'text-start' : ''}`}>
                    <div className={`flex items-center gap-1`}>
                        <CircleDollarSign className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="text-gray-600 text-sm">{t('Dashboard.startFrom')}</span>

                        <HoverCard openDelay={100} closeDelay={100}>
                            <HoverCardTrigger asChild>
                                <button className="ms-1 text-gray-400 hover:text-navy transition-colors cursor-pointer">
                                    <Trans
                                        i18nKey="Properties.firstPrice"
                                        values={{
                                            price: hasActiveOffer ? discountedPrice : originalPrice.price,
                                            period: t(originalPrice.periodKey),
                                            original: originalPrice.price
                                        }}
                                        components={{
                                            value: (
                                                <span className="text-lg font-bold text-amber-500" />
                                            ),
                                            currency: <span className="text-md text-gray-500" />,
                                            divider: <span className="text-md text-gray-400" />,
                                            period: <span className="text-md text-gray-400" />,
                                            // New component for strikethrough original price
                                            original: <span className={` ${hasActiveOffer ? "" : "hidden"} text-md text-gray-400 line-through ml-2`} />
                                        }}
                                    />

                                </button>
                            </HoverCardTrigger>

                            <HoverCardContent side="top" align="end" className="w-60 p-3">
                                <p className="text-xs text-center font-semibold text-navy mb-3">
                                    {t('Properties.priceBreakdown', 'Price Breakdown')}
                                </p>
                                <div className="space-y-2">
                                    {/* Remaining Prices */}
                                    {priceRows.map(({ price, discountedPrice, periodKey }, i) => (
                                        <div key={i} className={`flex ${isArabic ? 'flex-row-reverse' : ''} items-center justify-between`}>
                                            <div>
                                                <span className="text-amber-500">
                                                    {hasActiveOffer ? discountedPrice : price}
                                                </span>
                                                {hasActiveOffer && (
                                                    <span className="text-xs text-gray-400 line-through ml-2">
                                                        {price}
                                                    </span>
                                                )}
                                                <span className="text-gray-500 text-xs ml-1">{t("General.kwd")}</span>
                                            </div>
                                            <span className="text-xs font-semibold text-amber-500">
                                                {t(periodKey)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                    </div>
                </div>

                {/* Capacity */}
                <div className={`flex items-center gap-1.25 text-sm text-gray-600`}>
                    <Users className="w-4 h-4 shrink-0" />
                    <span>{property.guests} {t('Dashboard.person')}</span>
                </div>
            </div>
        </div>
    );
}