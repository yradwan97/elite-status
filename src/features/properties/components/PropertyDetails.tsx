import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
    Heart,
    Share2,
    ChevronRight,
    MapPin,
    Users,
    BedDouble,
    Bath,
    Sofa,
    FileText,
    ZoomIn,
    Navigation,
    MessageCircle,
    ArrowRight,
    Home,
    Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useProperty } from "../api/hooks/useProperty";
import { cn } from "@/lib/utils";
import { Facility } from "../api/propertiesApi";
import i18next from "i18next";
import DOMPurify from "dompurify";
import { OptimizedImage } from "@/components/shared/OptimizedImage";
import { RootState } from "@/store";
import { PageTitle } from "@/components/shared/PageTitle";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import moneyLogo from "@/assets/money-icon.png"

// ─── i18n keys (add to your translation files) ────────────────────────────
// Properties.Details namespace
// ──────────────────────────────────────────────────────────────────────────

export default function PropertyDetails() {
    const { id = "" } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const isRTL = i18next.language === "ar";
    const user = useSelector((state: RootState) => state.auth.user);

    const { property, isLoading, error, refetch } = useProperty(id);


    // Gallery state
    const [showAllPhotos, setShowAllPhotos] = useState(false);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    // Description expand
    const [descExpanded, setDescExpanded] = useState(false);

    // Wishlist / share UI state
    const [wishlisted, setWishlisted] = useState(false);

    // Tour form
    const [tourForm, setTourForm] = useState({ name: "", email: "", phone: "", message: "" });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-navy" />
            </div>
        );
    }

    if (error || !property) {
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
    const images = property.images ?? [];
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

    const documentLabels = [
        t("Properties.Details.doc.cancellation"),
        t("Properties.Details.doc.refund"),
        t("Properties.Details.doc.terms"),
    ];

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
                        <h1 className="text-2xl font-bold text-navy leading-tight">{title}</h1>
                        <div className="flex items-center gap-1 mt-1 text-gray-500 text-sm">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span>{property.address}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full border border-gray-200 hover:bg-red-50 hover:border-red-200"
                            onClick={() => setWishlisted(!wishlisted)}
                        >
                            <Heart className={cn("w-4 h-4", wishlisted ? "fill-red-500 text-red-500" : "text-gray-400")} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full border border-gray-200 hover:bg-blue-50"
                            onClick={() => console.log("share")}
                        >
                            <Share2 className="w-4 h-4 text-gray-400" />
                        </Button>
                    </div>
                </div>

                {/* ── Image Gallery ── */}
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 rounded-3xl overflow-hidden">

                        {/* Main Large Image - Left Side */}
                        <div
                            className="lg:col-span-8 relative cursor-pointer group overflow-hidden rounded-3xl"
                            onClick={() => images[0] && setLightboxImage(images[0])}
                        >
                            {images[0] ? (
                                <OptimizedImage
                                    src={images[0]}
                                    alt={title}
                                    priority
                                    className="w-full h-full object-contain group-hover:brightness-[0.92] transition-all duration-300 aspect-16/10 lg:aspect-auto lg:h-130"
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
                                onClick={() => images[1] && setLightboxImage(images[1])}
                            >
                                {images[1] ? (
                                    <OptimizedImage
                                        src={images[1]}
                                        alt={`${title} - view 2`}
                                        className="w-full h-full object-contain group-hover:brightness-[0.92] transition-all duration-300 aspect-16/10 lg:aspect-4/3"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100" />
                                )}
                            </div>

                            {/* Bottom Right Image (Image 3) - Fully Clickable + Button */}
                            <div
                                className="relative flex-1 cursor-pointer group overflow-hidden rounded-3xl"
                                onClick={() => images[2] && setLightboxImage(images[2])}
                            >
                                {images[2] ? (
                                    <OptimizedImage
                                        src={images[2]}
                                        alt={`${title} - view 3`}
                                        className="w-full h-full object-contain group-hover:brightness-[0.92] transition-all duration-300 aspect-16/10 lg:aspect-4/3"
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
                    <div className="space-y-6">

                        {/* Property meta strip */}
                        <div className="border border-gray-200 rounded-2xl p-4">
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                                <MetaStat
                                    icon={<Home className="w-4 h-4" />}
                                    label={t("Properties.Details.meta.type")}
                                    value={typeof property.propertyType === 'string' ? property.propertyType : property.propertyType.title}
                                />
                                <MetaStat
                                    icon={<Users className="w-4 h-4" />}
                                    label={t("Properties.Details.meta.guests")}
                                    value={`${property.guests} ${t("Properties.Details.meta.person")}`}
                                />
                                <MetaStat
                                    icon={<BedDouble className="w-4 h-4" />}
                                    label={t("Properties.Details.meta.bedrooms")}
                                    value={`${property.bedrooms} ${t("Properties.Details.meta.bedrooms")}`}
                                />
                                <MetaStat
                                    icon={<Bath className="w-4 h-4" />}
                                    label={t("Properties.Details.meta.bathrooms")}
                                    value={`${property.bathrooms} ${t("Properties.Details.meta.bathrooms")}`}
                                />
                                <MetaStat
                                    icon={<Sofa className="w-4 h-4" />}
                                    label={t("Properties.Details.meta.lounges")}
                                    value={`${property.lounges} ${t("Properties.Details.meta.bigLounge")}`}
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div
                            className="text-sm text-gray-500 leading-relaxed"
                            style={!descExpanded ? { maxHeight: "8rem", overflow: "hidden", maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)" } : undefined}
                            dangerouslySetInnerHTML={{ __html: descExpanded ? sanitizedDescription : descPreview }}
                        />
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

                        <Separator />

                        {/* Facilities */}
                        <div>
                            <h2 className="text-base font-bold text-navy mb-4">
                                {t("Properties.Details.section.facilities")}
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {visibleFacilities.map((f: Facility) => (
                                    <div
                                        key={f._id}
                                        className="flex flex-col items-center gap-1.5 border border-gray-200 rounded-xl px-5 py-3 min-w-20 text-center"
                                    >
                                        <span className="text-xl">
                                            <OptimizedImage src={f.icon!} alt={`${f.titleEn}-icon`} />
                                        </span>
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
                            </div>
                        </div>

                        <Separator />

                        {/* Documents */}
                        <div>
                            <h2 className="text-base font-bold text-navy mb-3">
                                {t("Properties.Details.section.documents")}
                            </h2>
                            <div className="flex flex-wrap gap-4">
                                {property.documents.map((docUrl, i) => (
                                    <a
                                        key={i}
                                        href={docUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-navy transition-colors group"
                                    >
                                        <FileText className="w-4 h-4 text-gray-400 group-hover:text-navy transition-colors" />
                                        <span className="underline-offset-2 hover:underline">
                                            {documentLabels[i] ?? `Document ${i + 1}`}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Location / Map */}
                        <div>
                            <h2 className="text-base font-bold text-navy mb-3">
                                {t("Properties.Details.section.location")}
                            </h2>
                            <div className="rounded-2xl overflow-hidden border border-gray-200 relative">
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
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-4">
                        {/* Rent card */}
                        <div className="border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                                    <span className="text-lg"><OptimizedImage alt="money logo" src={moneyLogo} /></span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">{t("Properties.Details.rent.startFrom")}</p>
                                    <div className="flex flex-row gap-2">
                                        <p className="text-xl font-bold text-navy">
                                            {property.dailyPrice} <span className="text-sm font-medium">KWD</span>
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
                                                                {value} KWD
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
                                disabled={!user}
                                onClick={() => {
                                    if (!user) return;
                                    navigate(`/properties/${property._id}/reservation`)
                                }}
                            >
                                <ArrowRight className={cn("w-4 h-4", isRTL && "rotate-180")} />
                            </Button>
                        </div>

                        {/* Schedule a Tour */}
                        <div className="border border-gray-200 rounded-2xl p-5">
                            <h3 className="font-bold text-navy text-base mb-4">
                                {t("Properties.Details.tour.title")}
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <Label className="text-lg text-gray-500 mb-1 block">{t("Properties.Details.tour.name")}</Label>
                                    <Input
                                        placeholder={t("Properties.Details.tour.namePlaceholder")}
                                        value={tourForm.name}
                                        onChange={(e) => setTourForm({ ...tourForm, name: e.target.value })}
                                        className="rounded-xl border-gray-200 text-lg placeholder:text-gray-300"
                                    />
                                </div>
                                <div>
                                    <Label className="text-lg text-gray-500 mb-1 block">{t("Properties.Details.tour.email")}</Label>
                                    <Input
                                        type="email"
                                        placeholder={t("Properties.Details.tour.emailPlaceholder")}
                                        value={tourForm.email}
                                        onChange={(e) => setTourForm({ ...tourForm, email: e.target.value })}
                                        className="rounded-xl border-gray-200 text-lg placeholder:text-gray-300"
                                    />
                                </div>
                                <div>
                                    <Label className="text-lg text-gray-500 mb-1 block">{t("Properties.Details.tour.phone")}</Label>
                                    <Input
                                        type="tel"
                                        placeholder={t("Properties.Details.tour.phonePlaceholder")}
                                        value={tourForm.phone}
                                        onChange={(e) => setTourForm({ ...tourForm, phone: e.target.value })}
                                        className={`rounded-xl border-gray-200 text-lg placeholder:text-gray-300 ${isRTL ? 'placeholder:text-right' : ''}`}
                                    />
                                </div>
                                <div>
                                    <Label className="text-lg text-gray-500 mb-1 block">{t("Properties.Details.tour.message")}</Label>
                                    <Textarea
                                        placeholder={t("Properties.Details.tour.messagePlaceholder")}
                                        value={tourForm.message}
                                        onChange={(e) => setTourForm({ ...tourForm, message: e.target.value })}
                                        className="rounded-xl border-gray-200 text-sm placeholder:text-gray-300 resize-none min-h-25"
                                    />
                                </div>
                                <Button
                                    className="w-full bg-navy hover:bg-[#243760] text-white rounded-xl h-11 font-semibold"
                                    onClick={() => console.log("Reserve a Tour", tourForm)}
                                    disabled={!user}
                                >
                                    {t("Properties.Details.tour.submit")}
                                </Button>
                                <div className="flex items-center gap-2">
                                    <Separator className="flex-1" />
                                    <span className="text-xs text-gray-400 uppercase tracking-wide">
                                        {t("Properties.Details.tour.or")}
                                    </span>
                                    <Separator className="flex-1" />
                                </div>
                                <Button
                                    className="w-full bg-[#25D366] hover:bg-[#1db954] text-white rounded-xl h-11 font-semibold gap-2"
                                    onClick={() => console.log("Reserve on Whatsapp")}
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    {t("Properties.Details.tour.whatsapp")}
                                </Button>
                            </div>
                        </div>
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
                    <DialogContent className="max-w-5xl w-full p-3 border-0 rounded-2xl overflow-hidden">
                        {lightboxImage && (
                            <OptimizedImage
                                src={lightboxImage}
                                alt="Full view"
                                className="w-full max-h-[85vh] object-contain"
                            />
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

// ── Helper component ──────────────────────────────────────────────────────

function MetaStat({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex flex-col items-center gap-1 text-center">
            <div className="text-gray-400">{icon}</div>
            <p className="text-[10px] uppercase tracking-wide text-gray-400">{label}</p>
            <p className="text-sm font-semibold text-navy leading-tight">{value}</p>
        </div>
    );
}