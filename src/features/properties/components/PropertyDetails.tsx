import { useLayoutEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
    Heart,
    Share2,
    ChevronRight,
    MapPin,
    FileText,
    ZoomIn,
    Navigation,
    ArrowRight,
    Home,
    Info,
    ArrowLeft,
    PlayCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useProperty } from "../api/hooks/useProperty";
import { checkLoggedIn, cn, isValidUrl } from "@/lib/utils";
import { Facility } from "../api/propertiesApi";
import i18next from "i18next";
import DOMPurify from "dompurify";
import { OptimizedImage } from "@/components/shared/OptimizedImage";
import { RootState } from "@/store";
import { PageTitle } from "@/components/shared/PageTitle";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import moneyLogo from "@/assets/money-icon.png"
import useToggleFavourite from "../api/hooks/useToggleFavourite";
import { toast } from "sonner";
import useTourMutation from "../api/hooks/useTourMutation";
import { useInfo } from "@/common/api/hooks/useInfo";
import { Spinner } from "@/components/ui/spinner"
import villaIcon from "@/assets/villa-icon.png"
import bedIcon from "@/assets/bed-icon.png"
import bathroomIcon from "@/assets/bathroom-icon.png"
import userIcon from "@/assets/user-icon.png"
import loungeIcon from "@/assets/lounge-icon.png";
import { TourForm, TourFormValues } from "./TourForm";


const Skeleton = ({ className }: { className?: string }) => (
    <div className={cn("animate-pulse bg-gray-200 rounded-md", className)} />
);

export default function PropertyDetails() {
    const { id = "" } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const isRTL = i18next.language === "ar";
    const user = useSelector((state: RootState) => state.auth.user);

    const { property, isLoading, refetch } = useProperty(id);
    const { info } = useInfo();


    // Gallery state
    const [showAllPhotos, setShowAllPhotos] = useState(false);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    // Description expand
    const [descExpanded, setDescExpanded] = useState(false);

    //Wishlist
    const [isFavourite, setIsFavourite] = useState(property?.isFavourite || false);

    const toggleFavourite = useToggleFavourite(property?._id || "");

    const tourMutation = useTourMutation();

    const handleReserveOnWhatsapp = () => {
        if (!info || !info.whatsappTours) return;
        const phoneNumber = info.whatsappTours;
        const currentHref = window.location.href;
        const message = t("Properties.Details.tour.whatsappMessage", { title: isRTL ? property?.titleAr : property?.titleEn });
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message + "\n" + currentHref)}`;
        window.open(whatsappUrl, "_blank");
    }

    useLayoutEffect(() => {
        if (property) {
            setIsFavourite(!!property.isFavourite);
        }
    }, [property]);

    if (!property) {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                    <Spinner className="size-12" />
                </div>
            );
        }
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <p className="text-gray-500">{t("Properties.Details.error")}</p>
                <Button onClick={() => refetch()}>{t("Properties.Details.retry")}</Button>
            </div>
        );
    }

    const priceRows = [
        { label: t('Dashboard.weekdays', 'Weekdays'), value: property.weekdaysPrice },
        { label: t('Dashboard.weekend', 'Weekend'), value: property.weekendPrice },
        { label: t('Dashboard.wholeWeek', 'Whole Week'), value: property.wholeWeekPrice },
        { label: t('Dashboard.dayUse', 'Day Use'), value: property.dayUsePrice },
    ];

    const title = isRTL ? property.titleAr : property.titleEn;
    const description = isRTL ? property.descriptionAr : property.descriptionEn;
    const sanitizedDescription = DOMPurify.sanitize(description ?? "", {
        ALLOWED_TAGS: ["p", "br", "strong", "em", "u", "span", "ul", "ol", "li", "h1", "h2", "h3"],
        ALLOWED_ATTR: ["style", "class"],
    });
    const images = [...property.images];
    const hasMorePhotos = images.length > 3;

    const descPreview = sanitizedDescription.slice(0, 380);
    const descNeedsExpand = sanitizedDescription.length > 380;

    const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "";
    const mapEmbedUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${property.lat},${property.long}&zoom=14&size=600x300&markers=color:red%7C${property.lat},${property.long}&key=${GOOGLE_MAPS_API_KEY}`;
    const navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${property.lat},${property.long}`;

    const MAX_VISIBLE_FACILITIES = 5;
    const visibleFacilities = (property.facilities || []).slice(0, MAX_VISIBLE_FACILITIES);
    const hiddenFacilitiesCount = (property.facilities || []).length > MAX_VISIBLE_FACILITIES
        ? property.facilities.length - MAX_VISIBLE_FACILITIES
        : 0;


    const handleFavouriteToggle = () => {
        toggleFavourite.mutate(isFavourite, {
            onSuccess: () => {
                setIsFavourite(!isFavourite);
            }
        });
    };

    const handleShare = async () => {
        if (!property) return;

        const url = window.location.href;
        const title = isRTL ? property.titleAr : property.titleEn
        const shareData = {
            title,
            text: `${t("Properties.Details.Share.text", { title })}`,
            url,
        };

        const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

        // 1. Native iOS share sheet — skip canShare() check on iOS/Safari
        //    since canShare() is unreliable there but share() works fine
        if (navigator.share && (isIOS || isSafari || navigator.canShare?.(shareData))) {
            try {
                await navigator.share(shareData);
                return;
            } catch (error) {
                if (error instanceof DOMException && error.name === "AbortError") return;
                console.error("Native share failed:", error);
            }
        }

        // 2. Safari-safe clipboard
        if (navigator.clipboard?.write) {
            try {
                const clipboardItem = new ClipboardItem({
                    "text/plain": new Blob([url], { type: "text/plain" }),
                });
                await navigator.clipboard.write([clipboardItem]);
                toast.success(t("Properties.Details.Share.copied"));
                return;
            } catch (error) {
                console.error("ClipboardItem write failed:", error);
            }
        }

        // 3. Async writeText (non-Safari modern browsers)
        if (navigator.clipboard?.writeText) {
            try {
                await navigator.clipboard.writeText(url);
                toast.success(t("Properties.Details.Share.copied"));
                return;
            } catch (error) {
                console.error("Clipboard writeText failed:", error);
            }
        }

        // 4. Legacy execCommand fallback
        try {
            const textArea = document.createElement("textarea");
            textArea.value = url;
            textArea.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0;";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const success = document.execCommand("copy");
            document.body.removeChild(textArea);
            if (success) {
                toast.success(t("Properties.Details.Share.copied"));
            } else {
                throw new Error("execCommand returned false");
            }
        } catch (error) {
            console.error("All copy methods failed:", error);
            toast.error(t("Properties.Details.Share.err"));
        }
    };

    const handleSubmitTour = (values: TourFormValues) => {
        if (!property?._id) return;
        tourMutation.mutate(
            { ...values, property: property._id },
            { onSuccess: () => { } } // reset is handled inside TourForm
        );
    };


    return (
        <>
            <PageTitle titleKey="" fallback={title} />
            <div
                dir={isRTL ? "rtl" : "ltr"}
                className="min-h-screen bg-white font-sans"
            >
                {/* ── Breadcrumb ── */}
                <div className="max-w-6xl mx-auto px-4 pt-5 pb-2">
                    <nav className="flex items-center gap-1 text-sm text-gray-500">
                        <button onClick={() => navigate("/")} className="hover:text-navy transition-colors">
                            {t("Properties.Details.breadcrumb.home")}
                        </button>
                        <ChevronRight className={cn("w-3 h-3", isRTL && "rotate-180")} />
                        <button onClick={() => navigate("/properties")} className="hover:text-navy transition-colors">
                            {t("Properties.Details.breadcrumb.properties")}
                        </button>
                        <ChevronRight className={cn("w-3 h-3", isRTL && "rotate-180")} />
                        <span className="text-navy font-medium">{t("Properties.Details.breadcrumb.details")}</span>
                    </nav>
                </div>

                {/* ── Title row ── */}
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-start justify-between gap-4">
                    <div>
                        {isLoading ? (
                            <Skeleton className="h-7 w-60" />
                        ) : (
                            <h1 className="text-2xl font-bold text-navy">{title}</h1>
                        )}
                        <div className="flex items-center gap-1 mt-1 text-gray-500 text-sm">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            {isLoading ? (
                                <Skeleton className="h-4 w-40 mt-2" />
                            ) : (
                                <span>{property.address}</span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        {(user && property) && <button
                            className="border-0 cursor-pointer rounded-full flex items-center justify-center transition-all hover:scale-110 "
                            onClick={handleFavouriteToggle}
                        >
                            <Heart className={cn("w-5 h-5", isFavourite ? "fill-red-500 text-red-500" : "text-gray-400")} />
                        </button>}

                        <button

                            className="border-0 cursor-pointer rounded-full flex items-center justify-center transition-all hover:scale-110 "
                            onClick={handleShare}
                        >
                            <Share2 className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* ── Image Gallery ── */}
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 rounded-3xl overflow-hidden">

                        {/* Main Large Image - Left Side */}
                        <div
                            className="lg:col-span-8 relative cursor-pointer group overflow-hidden rounded-3xl"
                            onClick={() => hasMorePhotos && setLightboxImage(images[0])}
                        >
                            {isLoading ? (
                                <Skeleton className="w-full h-132 rounded-3xl" />
                            ) : images[0] ? (
                                <OptimizedImage
                                    src={images[0]}
                                    alt={title}
                                    priority
                                    className="w-full h-full object-cover transition-all duration-300 aspect-16/10"
                                />
                            ) : (
                                <div className="w-full h-130 bg-gray-100 flex items-center justify-center">
                                    <Home className="w-20 h-20 text-gray-300" />
                                </div>
                            )}
                        </div>

                        {/* Right Side - Two Smaller Images Stacked */}
                        <div className="lg:col-span-4 flex flex-col gap-3">

                            {/* Top Right Image (Image 2) */}
                            <div
                                className="relative flex-1 cursor-pointer group overflow-hidden rounded-3xl"
                                onClick={() => hasMorePhotos && setLightboxImage(images[1])}
                            >
                                {isLoading ? (
                                    <Skeleton className="w-full h-130 rounded-3xl" />
                                ) : images[1] ? (
                                    <OptimizedImage
                                        src={images[1]}
                                        alt={`${title} - view 2`}
                                        className="w-full h-full object-cover group-hover:brightness-[0.92] transition-all duration-300 aspect-16/10 lg:h-65 lg:aspect-4/3"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-white" />
                                )}
                            </div>

                            {/* Bottom Right Image (Image 3) - Fully Clickable + Button */}
                            <div
                                className="relative flex-1 cursor-pointer group overflow-hidden rounded-3xl"
                                onClick={() => hasMorePhotos && setLightboxImage(images[2])}
                            >
                                {isLoading ? (
                                    <Skeleton className="w-full h-130 rounded-3xl" />
                                ) : images[2] ? (
                                    <OptimizedImage
                                        src={images[2]}
                                        alt={`${title} - view 3`}
                                        className="w-full h-full object-cover group-hover:brightness-[0.92] transition-all duration-300 aspect-16/10 lg:h-65 lg:aspect-4/3"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-white" />
                                )}

                                {/* See All Photos Button - Bottom Right of 3rd Image */}
                                {hasMorePhotos && (
                                    <div className="absolute bottom-4 right-4 z-10">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();        // Prevent opening lightbox
                                                setShowAllPhotos(true);
                                            }}
                                            className="flex items-center gap-2 bg-white/95 hover:bg-white text-gray-900 text-sm font-medium px-5 py-2.5 rounded-2xl shadow-lg transition-all active:scale-[0.97]"
                                        >
                                            <ZoomIn className="w-4 h-4" />
                                            {t("Properties.Details.gallery.seeAll")}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Main content ── */}
                <div className="max-w-6xl mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 pb-16">
                    {/* LEFT COLUMN */}
                    <div className="space-y-6 order-2 sm:order-first">

                        {/* Property meta strip */}
                        <div className="border border-gray-200 rounded-2xl h-auto sm:h-23.5 p-2 flex items-center justify-start">
                            {isLoading ? (
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Skeleton key={i} className="h-16 rounded-xl" />
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-7">
                                    <MetaStat
                                        iconSrc={villaIcon}
                                        label={t("Properties.Details.meta.type")}
                                        value={typeof property.propertyType === 'string' ? property.propertyType : t(`Properties.Details.propertyType.${property.propertyType.key}`)}
                                    />
                                    <MetaStat
                                        iconSrc={userIcon}
                                        label={t("Properties.Details.meta.guests")}
                                        value={`${property.guests} ${t("Properties.Details.meta.person")}`}
                                    />
                                    <MetaStat
                                        iconSrc={bedIcon}
                                        label={t("Properties.Details.meta.bedrooms")}
                                        value={`${property.bedrooms} ${t("Properties.Details.meta.bedrooms")}`}
                                    />
                                    <MetaStat
                                        iconSrc={bathroomIcon}
                                        label={t("Properties.Details.meta.bathrooms")}
                                        value={`${property.bathrooms} ${t("Properties.Details.meta.bathrooms")}`}
                                    />
                                    <MetaStat
                                        iconSrc={loungeIcon}
                                        label={t("Properties.Details.meta.lounges")}
                                        value={`${property.lounges} ${t("Properties.Details.meta.bigLounge")}`}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="flex flex-col justify-start items-start gap-4 p-4 rounded-lg bg-[#f9f9f9]">
                            {isLoading ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-3 w-full" />
                                    <Skeleton className="h-3 w-5/6" />
                                    <Skeleton className="h-3 w-4/6" />
                                </div>
                            ) :
                                <div
                                    className="text-sm text-gray-500 leading-relaxed"
                                    style={!descExpanded ? { maxHeight: "8rem", overflow: "hidden", maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)" } : undefined}
                                    dangerouslySetInnerHTML={{ __html: descExpanded ? sanitizedDescription : descPreview }}
                                />}
                            {descNeedsExpand && (
                                <button
                                    className="text-navy capitalize font-semibold hover:underline text-sm mt-1"
                                    onClick={() => setDescExpanded(!descExpanded)}
                                >
                                    {descExpanded
                                        ? t("Properties.Details.description.seeLess")
                                        : t("Properties.Details.description.seeMore")
                                    }
                                </button>
                            )}

                        </div>

                        {(!!property?.video && isValidUrl(property.video)) && (
                            <div className="rounded-lg bg-[#f9f9f9] p-4">
                                <h2 className="text-base font-bold text-navy mb-4">
                                    {t("Properties.Details.section.video")}
                                </h2>

                                <a
                                    href={property.video}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <PlayCircle className="w-4 h-4" />
                                        {t("Properties.Details.section.watchVideo")}
                                    </Button>
                                </a>
                            </div>
                        )}

                        {/* Facilities */}
                        <div className="rounded-lg bg-[#f9f9f9] p-4">
                            <h2 className="text-base font-bold text-navy mb-4">
                                {t("Properties.Details.section.facilities")}
                            </h2>
                            {isLoading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="flex flex-col items-center gap-1.5 border border-gray-200 rounded-xl px-5 py-3 min-w-20 text-center">
                                        <Skeleton className="w-6 h-6 rounded-md" />
                                        <Skeleton className="w-12 h-3" />
                                    </div>
                                ))
                            ) : property.facilities.length > 0 ? <div className="flex flex-wrap gap-3">
                                {visibleFacilities.map((f: Facility) => (
                                    <div
                                        key={f._id}
                                        className="flex flex-col items-center gap-2.5 border bg-white shadow-md border-gray-200 rounded-[5px] px-5 py-2.5 min-w-20 w-30.5 h-21.75 text-center"
                                    >
                                        <OptimizedImage className="size-10 p-1" src={f.icon!} alt={`${f.titleEn}-icon`} />
                                        <span className="text-xs text-gray-600 font-medium">
                                            {i18next.language === "ar" ? f.titleAr : f.titleEn}
                                        </span>
                                    </div>
                                ))}
                                {hiddenFacilitiesCount > 0 && (
                                    <div className="flex flex-col items-center justify-center gap-1.5 border border-gray-200 rounded-xl px-5 py-3 min-w-20 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                                        <span className="text-xl">•••</span>
                                        <span className="text-xs text-gray-600 font-medium">
                                            {t("Properties.Details.facilities.seeMore")}
                                        </span>
                                    </div>
                                )}
                            </div> : <p>{t("Properties.Details.facilities.none")}</p>}
                        </div>

                        {/* Documents */}
                        <div className="rounded-lg shadow-lg bg-[#f9f9f9] p-4">
                            <h2 className="text-base font-bold text-navy mb-3">
                                {t("Properties.Details.section.documents")}
                            </h2>
                            <div className="flex flex-wrap gap-4">
                                {isLoading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <Skeleton className="w-4 h-4 rounded" />
                                            <Skeleton className="w-24 h-4" />
                                        </div>
                                    ))
                                ) : property.documents.map(({ key, path }) => (
                                    <a
                                        key={key}
                                        href={path}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-navy transition-colors group"
                                    >
                                        <FileText className="size-5 text-navy transition-colors" />
                                        <span className="underline-offset-2 group-hover:underline">
                                            {key}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Location / Map */}
                        <div className="rounded-lg shadow-lg bg-[#f9f9f9] p-4">
                            <h2 className="text-base font-bold text-navy mb-3">
                                {t("Properties.Details.section.location")}
                            </h2>
                            {isLoading ? (
                                <div className="rounded-2xl overflow-hidden border border-gray-200">
                                    {/* map area */}
                                    <Skeleton className="w-full h-55" />

                                    {/* footer button area */}
                                    <div className="p-3 border-t border-gray-100 flex justify-end">
                                        <Skeleton className="w-28 h-8 rounded-md" />
                                    </div>
                                </div>
                            ) : <div className="rounded-2xl overflow-hidden border border-gray-200 relative">
                                {GOOGLE_MAPS_API_KEY ? (
                                    <OptimizedImage
                                        src={mapEmbedUrl}
                                        alt="Map"
                                        className="w-full h-55 object-cover"
                                    />
                                ) : (
                                    <iframe
                                        title="property-map"
                                        width="100%"
                                        height="220"
                                        style={{ border: 0 }}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        src={`https://maps.google.com/maps?q=${property.lat},${property.long}&z=14&output=embed`}
                                    />
                                )}
                                <div className="p-3 bg-white border-t border-gray-100 flex justify-end">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-navy border-navy hover:bg-navy hover:text-white transition-colors gap-1.5"
                                        onClick={() => window.open(navigationUrl, "_blank")}
                                    >
                                        <Navigation className="w-4 h-4" />
                                        {t("Properties.Details.map.navigate")}
                                    </Button>
                                </div>
                            </div>}
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-4">
                        {isLoading ? (
                            <>
                                <RentCardSkeleton />
                                <TourFormSkeleton />
                            </>
                        ) :
                            <>
                                {/* Rent card */}
                                <div className="border border-gray-200 rounded-2xl p-4 h-23.5 mb-6 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                                            <span className="text-lg"><OptimizedImage alt="money logo" src={moneyLogo} /></span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">{t("Properties.Details.rent.startFrom")}</p>
                                            <div className="flex flex-row gap-2">
                                                <p className="text-xl font-bold text-navy">
                                                    {property.dailyPrice} <span className="text-sm font-medium">{t("General.kwd")}</span>
                                                </p>
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
                                                                <div key={label} className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center justify-between`}>
                                                                    <span className="text-xs text-gray-500">{label}</span>
                                                                    <span className="text-xs font-semibold text-amber-500">
                                                                        {value} {t("General.kwd")}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </HoverCardContent>
                                                </HoverCard>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        className="rounded-sm w-15 h-10 p-0 bg-navy cursor-pointer hover:bg-[#243760] text-white disabled:opacity-40 disabled:cursor-not-allowed"
                                        onClick={() => {
                                            if (checkLoggedIn(user)) {
                                                navigate(`/properties/${property._id}/reservation`)
                                            }
                                        }}
                                    >
                                        <ArrowRight className={cn("w-4 h-4", isRTL && "rotate-180")} />
                                    </Button>
                                </div>
                                <TourForm
                                    onSubmit={(values) => {
                                        if (checkLoggedIn(user)) handleSubmitTour(values);
                                    }}
                                    onWhatsapp={handleReserveOnWhatsapp}
                                    isSubmitting={tourMutation.isPending}
                                />
                            </>}
                    </div>
                </div>

                {/* ── All Photos Modal ── */}
                <Dialog open={showAllPhotos} onOpenChange={setShowAllPhotos}>
                    <DialogContent className="max-w-3xl w-full rounded-2xl p-6">
                        <DialogHeader>
                            <DialogTitle className="text-navy">
                                {t("Properties.Details.gallery.allPhotos")}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[70vh] overflow-y-auto mt-2">
                            {images.map((img, i) => (
                                <div
                                    key={i}
                                    className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group"
                                    onClick={() => setLightboxImage(img)}
                                >
                                    <OptimizedImage
                                        src={img}
                                        alt={`Photo ${i + 1}`}
                                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
                                        <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>

                {/* ── Lightbox Modal ── */}
                <Dialog open={!!lightboxImage} onOpenChange={() => setLightboxImage(null)}>
                    <DialogContent className="max-w-6xl w-full p-0 border-2 rounded-4xl overflow-hidden">
                        {lightboxImage && (() => {
                            const currentIndex = images.indexOf(lightboxImage);
                            const hasPrev = currentIndex > 0;
                            const hasNext = currentIndex < images.length - 1;

                            return (
                                <div className="relative">
                                    <OptimizedImage
                                        src={lightboxImage}
                                        alt="Full view"
                                        className="w-full max-h-[85vh] object-cover"
                                    />

                                    {hasPrev && (
                                        <button
                                            onClick={() => setLightboxImage(images[currentIndex - 1])}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2.5 transition-all backdrop-blur-sm"
                                            aria-label="Previous image"
                                        >
                                            <ArrowLeft className="w-5 h-5" />
                                        </button>
                                    )}

                                    {hasNext && (
                                        <button
                                            onClick={() => setLightboxImage(images[currentIndex + 1])}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2.5 transition-all backdrop-blur-sm"
                                            aria-label="Next image"
                                        >
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    )}

                                    {/* Image counter */}
                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                                        {currentIndex + 1} / {images.length}
                                    </div>
                                </div>
                            );
                        })()}
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

// ── Helper component ──────────────────────────────────────────────────────

function MetaStat({
    iconSrc,
    label,
    value,
}: {
    iconSrc: string;
    label: string;
    value: string;
}) {
    return (
        <div className="flex flex-col items-start gap-1 text-center">
            <p className="text-[10px] uppercase tracking-wide text-gray-400">{label}</p>
            <div className="flex gap-2">
                <OptimizedImage src={iconSrc} className="size-5" alt={`${label}-icon`} />
                <p className="text-sm font-semibold text-navy leading-tight">{value}</p>
            </div>
        </div>
    );
}

const RentCardSkeleton = () => {
    return (
        <div className="border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />

                <div className="space-y-2">
                    <Skeleton className="w-24 h-3" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-20 h-5" />
                        <Skeleton className="w-4 h-4 rounded" />
                    </div>
                </div>
            </div>

            <Skeleton className="w-10 h-10 rounded-md" />
        </div>
    );
};

const TourFormSkeleton = () => {
    return (
        <div className="border border-gray-200 rounded-2xl p-5 space-y-4">
            <Skeleton className="w-40 h-4" />

            <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-1">
                        <Skeleton className="w-24 h-3" />
                        <Skeleton className="w-full h-10 rounded-xl" />
                    </div>
                ))}

                <Skeleton className="w-full h-11 rounded-xl" />

                <div className="flex items-center gap-2">
                    <Skeleton className="flex-1 h-1" />
                    <Skeleton className="w-10 h-3" />
                    <Skeleton className="flex-1 h-1" />
                </div>

                <Skeleton className="w-full h-11 rounded-xl" />
            </div>
        </div>
    );
};