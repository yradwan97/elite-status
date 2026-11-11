import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { ArrowLeft, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { GroupChalet, GroupDetails, PriceKey } from '../../../api/propertiesApi'
import { OptimizedImage } from '@/components/shared/OptimizedImage'
import chaletGroupBg from '@/assets/chalet-group-bg.png'
import chaletGroupCurvedBg from '@/assets/chalet-group-curved-bg.svg'
import GroupUnitCard from './GroupUnitCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import type { DateRange } from 'react-day-picker'
import { PricingPlan } from '../../types/types'
import { TermsCheckbox } from '../TermsCheckbox'
import { useGroupReservedDates } from '../../api/hooks/useGroupReservedDates'

// ─── types ───────────────────────────────────────────────────────────────────

export type GroupSelection = {
    unit: GroupChalet
    planKey: PricingPlan['key']
    price: number
    startDate: Date
    endDate: Date
}

const DESKTOP_PER_ROW = 15 // max chalets per row over the image
// const MOBILE_COLS = 5      // columns in the grid below the image on mobile
const GAP = 3 // px, keep in sync with gap-[3px]
const MAX_WIDTH_FACTOR = 1.5

// Width a card gets when the row holds MAX_PER_ROW chalets, times the factor.
// `100%` resolves against the flex container's content box (after px-6).
const maxCardWidth = `calc((100% - ${(DESKTOP_PER_ROW - 1) * GAP}px) / ${DESKTOP_PER_ROW} * ${MAX_WIDTH_FACTOR})`

type GroupPricingStepProps = {
    property: GroupDetails
    acceptedTerms: boolean
    onTermsChange: (accepted: boolean) => void
    /** Fires whenever unit + dates change; `null` when the selection is cleared */
    onSelect: (selection: GroupSelection | null) => void
    onNext: () => void
    onBack: () => void
}

const PACKAGES = [
    { key: 'WEEK_DAYS', priceField: 'weekdaysPrice', labelKey: 'Properties.Reservation.pricing.group.weekdays', fallback: 'Weekdays', startDay: 0, length: 4 },
    { key: 'WHOLE_WEEK_SUNDAY', priceField: 'wholeWeekSundayPrice', labelKey: 'Properties.Reservation.pricing.group.wholeWeekSunday', fallback: 'Whole week (Sun)', startDay: 0, length: 7 },
    { key: 'WEEK_END', priceField: 'weekendPrice', labelKey: 'Properties.Reservation.pricing.group.weekend', fallback: 'Weekend', startDay: 4, length: 3 },
    { key: 'WHOLE_WEEK_THURSDAY', priceField: 'wholeWeekThursdayPrice', labelKey: 'Properties.Reservation.pricing.group.wholeWeekThursday', fallback: 'Whole week (Thu)', startDay: 4, length: 7 },
] as const satisfies readonly {
    key: string
    priceField: PriceKey
    labelKey: string
    fallback: string
    startDay: number
    length: number
}[]

// Daily bookings: Sunday (0) to Wednesday (3) only
const isDailyDisabledDay = (date: Date) => date.getDay() > 3

// ─── helpers ─────────────────────────────────────────────────────────────────

function toMidnight(d: Date): Date {
    const copy = new Date(d)
    copy.setHours(0, 0, 0, 0)
    return copy
}

function addDays(date: Date, days: number): Date {
    const d = new Date(date)
    d.setDate(d.getDate() + days)
    return d
}

function addMonths(date: Date, months: number): Date {
    return new Date(date.getFullYear(), date.getMonth() + months, 1)
}

/** Every Sunday-started week that touches the given month. */
function getWeekStarts(month: Date): Date[] {
    const first = new Date(month.getFullYear(), month.getMonth(), 1)
    const last = new Date(month.getFullYear(), month.getMonth() + 1, 0)
    const cur = addDays(first, -first.getDay())
    const weeks: Date[] = []
    while (cur <= last) {
        weeks.push(new Date(cur))
        cur.setDate(cur.getDate() + 7)
    }
    return weeks
}

function rangeHasReserved(from: Date, to: Date, reserved: Set<string>): boolean {
    const cur = new Date(from)
    while (cur <= to) {
        if (reserved.has(cur.toDateString())) return true
        cur.setDate(cur.getDate() + 1)
    }
    return false
}

function daysBetweenInclusive(from: Date, to: Date): number {
    return Math.round((toMidnight(to).getTime() - toMidnight(from).getTime()) / 86_400_000) + 1
}

// ─── month header (shared by both views) ─────────────────────────────────────

type MonthHeaderProps = {
    month: Date
    canGoPrev: boolean
    onPrev: () => void
    onNext: () => void
}

const MonthHeader = ({ month, canGoPrev, onPrev, onNext }: MonthHeaderProps) => {
    const isRTL = i18next.language === 'ar'
    const Prev = isRTL ? ChevronRight : ChevronLeft
    const Next = isRTL ? ChevronLeft : ChevronRight

    return (
        <div className="flex items-center justify-between rounded-lg bg-slate-200 px-4 py-3 mb-4">
            <button
                type="button"
                onClick={onPrev}
                disabled={!canGoPrev}
                className="rounded-full border border-navy p-1 text-navy disabled:opacity-30"
            >
                <Prev className="w-4 h-4" />
            </button>
            <span className="font-bold text-navy text-xl">
                {month.toLocaleDateString(i18next.language, { month: 'long', year: 'numeric' })}
            </span>
            <button
                type="button"
                onClick={onNext}
                className="rounded-full border border-navy p-1 text-navy"
            >
                <Next className="w-4 h-4" />
            </button>
        </div>
    )
}

// ─── packages list ───────────────────────────────────────────────────────────

type PackagesListProps = {
    property: GroupDetails
    month: Date
    reservedSet: Set<string>
    today: Date
    isLoading: boolean
    onPick: (planKey: PricingPlan['key'], price: number, start: Date, end: Date) => void
}

const GRID_COLS: Record<number, string> = {
    1: 'lg:grid-cols-2',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
}

const PackagesList = ({ property, month, reservedSet, today, isLoading, onPick }: PackagesListProps) => {
    const { t } = useTranslation()
    const weeks = useMemo(() => getWeekStarts(month), [month])
    const isMobile = useIsMobile()
    const fmt = (d: Date) =>
        d.toLocaleDateString(
            i18next.language,
            isMobile
                ? { day: 'numeric', month: 'short' }                    // "6 Sep"
                : { weekday: 'short', day: 'numeric', month: 'short' }  // "Sun, 6 Sep"
        )

    const columns = PACKAGES.map((pkg) => {
        const price = property[pkg.priceField]
        if (!price) return { pkg, cards: [] }

        const cards = weeks.flatMap((weekStart) => {
            const start = addDays(weekStart, pkg.startDay)
            // Only list packages that start inside the visible month
            if (start.getMonth() !== month.getMonth() || start.getFullYear() !== month.getFullYear()) return []

            const end = addDays(start, pkg.length - 1)
            return [{
                start,
                end,
                price,
                isPast: start < today,
                isBooked: rangeHasReserved(start, end, reservedSet),
            }]
        })

        return { pkg, cards }
    }).filter((col) => col.cards.length > 0)

    if (columns.length === 0) return null

    return (
        <div className={cn('grid grid-cols-2 gap-3 items-start', GRID_COLS[columns.length], isMobile && `grid-cols-${columns.length}`)}>
            {columns.map(({ pkg, cards }) => (
                <div key={pkg.key} className="flex flex-col gap-3">
                    {cards.map(({ start, end, price, isPast, isBooked }) => {
                        const unavailable = isPast || isBooked || !!isLoading
                        return (
                            <div
                                key={start.toISOString()}
                                className="flex flex-col rounded-xl min-h-32.5 border border-gray-200 bg-white p-3 gap-3"
                            >
                                <div className="flex items-stretch justify-around gap-2">
                                    <div className="flex gap-2 min-w-0">
                                        <CalendarDays className="w-5 h-5 text-gray-400 shrink-0" />
                                        <div className="min-w-0">
                                            <p className="font-semibold text-navy text-sm block">
                                                {t(pkg.labelKey, { defaultValue: pkg.fallback })}{' '}
                                                <span className="hidden sm:inline">
                                                    ({pkg.length} {t('General.days', { defaultValue: 'Days' })})
                                                </span>
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {fmt(start)} - {fmt(end)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-end shrink-0">
                                        <p className="font-bold text-navy text-sm">{price} {t('General.kwd')}</p>
                                        <p className={cn('text-xs', unavailable ? 'text-red-500' : 'text-green-600')}>
                                            {isBooked
                                                ? t('Properties.Reservation.pricing.group.booked', { defaultValue: 'Booked' }) :
                                                !isPast && !isBooked ?
                                                    t('Properties.Reservation.pricing.group.available', { defaultValue: 'Available' }) :
                                                    null}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    className="w-full mt-auto h-9 bg-navy hover:bg-[#243760] text-white rounded-lg"
                                    disabled={unavailable}
                                    onClick={() => onPick(pkg.key, price, start, end)}
                                >
                                    {t('Properties.Reservation.pricing.group.select', { defaultValue: 'Select' })}
                                </Button>
                            </div>

                        )
                    })}
                </div>
            ))}
        </div>
    )
}

// ─── daily calendar ──────────────────────────────────────────────────────────

type DailyCalendarProps = {
    month: Date
    onMonthChange: (month: Date) => void
    reservedSet: Set<string>
    today: Date
    isLoading: boolean
    selected: DateRange | undefined
    onPick: (date: DateRange | undefined) => void
}

const DailyCalendar = ({ month, onMonthChange, reservedSet, today, selected, onPick, isLoading }: DailyCalendarProps) => {
    const reservedMatcher = (date: Date) => reservedSet.has(toMidnight(date).toDateString())

    return (
        <div className="rounded-2xl flex justify-center border border-gray-200 bg-white p-8">
            <Calendar
                mode="range"
                weekStartsOn={0}
                month={month}
                onMonthChange={onMonthChange}
                selected={selected}
                onSelect={onPick}
                disabled={[
                    { before: today },
                    reservedMatcher,
                    isDailyDisabledDay,
                    ...(isLoading ? [() => true] : []),
                ]}
                modifiers={{ reserved: reservedMatcher }}
                modifiersClassNames={{
                    // Booked days: red tint + strikethrough, distinct from plain disabled days
                    reserved: 'bg-red-50 text-red-500 line-through opacity-100 rounded-md',
                }}
                classNames={{ month_caption: 'hidden', nav: 'hidden' }}
                className="w-3/4 max-w-md rounded-lg"
            />
        </div>
    )
}

// ─── selected unit view ──────────────────────────────────────────────────────

type UnitBookingProps = {
    unit: GroupChalet
    property: GroupDetails
    acceptedTerms: boolean
    onTermsChange: (accepted: boolean) => void
    onSelect: (selection: GroupSelection | null) => void
    onNext: () => void
    onBack: () => void
}

const UnitBooking = ({ unit, property, acceptedTerms, onTermsChange, onSelect, onNext, onBack }: UnitBookingProps) => {
    const { t } = useTranslation()
    const today = useMemo(() => toMidnight(new Date()), [])
    const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
    const [dailyRange, setDailyRange] = useState<DateRange | undefined>()

    // Unit-level reservations (adjust the id if your unit exposes a different one)
    const { chalets, isLoading } = useGroupReservedDates(property._id)

    const reservedSet = useMemo(() => {
        const s = new Set<string>()
        const chalet = chalets.find((c) => c.chaletId === unit._id)

        chalet?.rentedDates.forEach((r) => {
            const start = toMidnight(new Date(r.startDate))
            const end = toMidnight(new Date(r.endDate))
            if (isNaN(start.getTime()) || isNaN(end.getTime())) return

            const cur = new Date(start)
            while (cur <= end) {
                s.add(cur.toDateString())
                cur.setDate(cur.getDate() + 1)
            }
        })
        return s
    }, [chalets, unit._id])

    // A unit is "daily" when it has a DAILY price entry
    const isDaily = unit.isDailyRentAllowed && property.dailyPrice > 0

    const canGoPrev = month > new Date(today.getFullYear(), today.getMonth(), 1)

    const handlePickPackage = (planKey: PricingPlan['key'], price: number, start: Date, end: Date) => {
        onSelect({ unit, planKey, price, startDate: start, endDate: end })
        onNext()
    }

    const clearDaily = () => {
        setDailyRange(undefined)
        onSelect(null)
    }

    const hasDisabledDay = (from: Date, to: Date) => {
        for (const d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
            if (isDailyDisabledDay(d) || reservedSet.has(toMidnight(d).toDateString())) return true
        }
        return false
    }

    const handlePickDaily = (range: DateRange | undefined) => {
        if (!range?.from || hasDisabledDay(range.from, range.to ?? range.from)) {
            clearDaily()
            return
        }

        const end = range.to ?? range.from // a single click gives { from } with no `to`
        setDailyRange(range)
        onSelect({
            unit,
            planKey: 'DAILY',
            price: property.dailyPrice * daysBetweenInclusive(range.from, end),
            startDate: range.from,
            endDate: end,
        })
    }

    const packages = (
        <PackagesList
            property={property}
            month={month}
            reservedSet={reservedSet}
            isLoading={isLoading}
            today={today}
            onPick={handlePickPackage}
        />
    )

    return (
        <div className='mt-auto'>
            <MonthHeader
                month={month}
                canGoPrev={canGoPrev}
                onPrev={() => setMonth((m) => addMonths(m, -1))}
                onNext={() => setMonth((m) => addMonths(m, 1))}
            />

            {isDaily ? (
                <Tabs defaultValue="groups" className="flex flex-col gap-4">
                    <TabsList className="flex bg-white min-h-12 w-full border border-gray-200 rounded-lg p-1">
                        <TabsTrigger
                            value="groups"
                            className="text-navy hover:text-navy data-[state=active]:text-white data-[state=active]:hover:text-white data-[state=active]:bg-[#D4A829]"
                        >
                            {t('Properties.Reservation.pricing.group.packages')}
                        </TabsTrigger>
                        <TabsTrigger
                            value="daily"
                            className="text-navy hover:text-navy data-[state=active]:text-white data-[state=active]:hover:text-white data-[state=active]:bg-[#D4A829]"
                        >
                            {t('General.daily')}
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="groups">{packages}</TabsContent>
                    <TabsContent value="daily">
                        <DailyCalendar
                            month={month}
                            onMonthChange={setMonth}
                            reservedSet={reservedSet}
                            today={today}
                            isLoading={isLoading}
                            selected={dailyRange}
                            onPick={handlePickDaily}
                        />
                        <TermsCheckbox acceptedTerms={acceptedTerms} onTermsChange={onTermsChange} />

                        {/* ACTIONS */}
                        <div className="flex gap-3 mt-10">
                            <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={onBack}>
                                <ArrowLeft className={`w-4 h-4 mr-2 ${i18next.language === 'ar' ? 'rotate-180' : ''}`} />
                                {t('Properties.Reservation.back')}
                            </Button>

                            <Button
                                className="flex-1 bg-navy hover:bg-[#243760] text-white h-12 font-semibold rounded-xl"
                                disabled={!dailyRange?.from || !acceptedTerms}
                                onClick={onNext}
                            >
                                {t('Properties.Reservation.next')}
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            ) : (
                packages
            )}
        </div>
    )
}

// ─── fanned chalets (mobile) ──────────────────────────────────────────────────────────

// ─── fanned layout (mobile) ──────────────────────────────────────────────────

const MAX_PER_ROW = 15 // hard cap per arc (mobile) and per row (desktop)

/** Splits into the fewest arcs of at most `max`, sized evenly (16 → 8 + 8, not 15 + 1). */
function chunkEvenly<T>(items: T[], max: number): T[][] {
    if (items.length === 0) return []
    const arcCount = Math.ceil(items.length / max)
    const size = Math.ceil(items.length / arcCount)
    const out: T[][] = []
    for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size))
    return out
}

type FannedChaletsProps = {
    chalets: GroupChalet[]
    renderCard: (unit: GroupChalet) => React.ReactNode
    selectedId?: string
}

const FannedArc = ({ chalets, renderCard, selectedId }: FannedChaletsProps) => {
    const n = chalets.length
    const maxAngle = 28 // tilt at the very edge of the full-width arc
    const depth = 38    // px the center rises above the edges of the full-width arc

    // How much of the full arc these cards cover (cards are capped at 1.5× slot width)
    const coverage = Math.min(1, (n * MAX_WIDTH_FACTOR) / MAX_PER_ROW)

    const selIdx = chalets.findIndex((c) => c._id === selectedId)
    const pushX = (i: number) =>
        selIdx < 0 || i === selIdx
            ? 0
            : Math.sign(i - selIdx) * Math.max(0, 6 - Math.abs(i - selIdx) * 2)

    return (
        <div className="flex items-end justify-center w-full gap-0.75 px-[6%]" style={{ paddingTop: depth + 12 }}>
            {chalets.map((unit, i) => {
                // -1…1 across the covered part of the arc (centered)
                const t = n === 1 ? 0 : ((i / (n - 1)) * 2 - 1) * coverage
                const lift = depth * (1 - t * t)
                const angle = t * maxAngle
                const isSelected = selectedId === unit._id

                return (
                    <div
                        key={unit._id}
                        className="relative flex-1 min-w-0 transition-transform duration-200"
                        style={{
                            maxWidth: maxCardWidth,
                            transform: `translateX(${pushX(i)}px) translateY(${-lift - (isSelected ? 6 : 0)}px) rotate(${angle}deg)${isSelected ? ' scale(1.08)' : ''}`,
                            zIndex: isSelected ? 20 : 1,
                        }}
                    >
                        {renderCard(unit)}
                    </div>
                )
            })}
        </div>
    )
}

const FannedChalets = (props: FannedChaletsProps) => (
    <div className="flex flex-col gap-4 mt-4 overflow-x-clip">
        {chunkEvenly(props.chalets, MAX_PER_ROW).map((arc, i) => (
            <FannedArc key={i} {...props} chalets={arc} />
        ))}
    </div>
)

// ─── main component ──────────────────────────────────────────────────────────

const GroupPricingStep = ({ property, acceptedTerms, onTermsChange, onSelect, onNext, onBack }: GroupPricingStepProps) => {
    const { t } = useTranslation()
    const isMobile = useIsMobile()
    const [selectedUnit, setSelectedUnit] = useState<GroupChalet | null>(null)

    const perRow = Math.min(property.chalets.length, DESKTOP_PER_ROW)

    const renderCard = (unit: GroupChalet) => (
        <GroupUnitCard
            key={unit._id}
            unit={unit}
            isSelected={selectedUnit?._id === unit._id}
            onSelect={() => handleSelectUnit(unit)}
        />
    )

    const handleSelectUnit = (unit: GroupChalet) => {
        onSelect(null)
        setSelectedUnit((prev) => (prev?._id === unit._id ? null : unit))
    }

    return (
        <div className="w-full max-w-6xl mx-auto">
            <div className="relative">
                <OptimizedImage src={isMobile ? chaletGroupCurvedBg : chaletGroupBg} alt="Chalet group display" />
                {!isMobile ? (
                    <div className={cn("absolute inset-x-[4%] flex flex-wrap justify-center", property.chalets.length > 15 ? "gap-y-0 top-[43%]" : "gap-y-2 top-[48%]",)}>
                        {property.chalets.map((unit) => (
                            <div
                                key={unit._id}
                                style={{ flexBasis: `${100 / perRow}%` }}
                                className="flex justify-center px-0.5"
                            >
                                {renderCard(unit)}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="absolute inset-x-0 bottom-[10%]">
                        <FannedChalets chalets={property.chalets} renderCard={renderCard} selectedId={selectedUnit?._id} />
                    </div>
                )}
            </div>

            {/* {isMobile && (
                
            )} */}

            <div className={isMobile ? 'mt-6' : 'mt-32'}>
                {selectedUnit ? (
                    <UnitBooking
                        key={selectedUnit._id}
                        unit={selectedUnit}
                        property={property}
                        acceptedTerms={acceptedTerms}
                        onTermsChange={onTermsChange}
                        onSelect={onSelect}
                        onNext={onNext}
                        onBack={onBack}
                    />
                ) : (
                    <div className="flex flex-col justify-center gap-1.75">
                        <p className="text-center text-gray-600" style={{ lineHeight: '14px', fontSize: '18px', letterSpacing: '2%' }}>
                            {t('Properties.Reservation.pricing.group.no-selection-1')}
                        </p>
                        <p className="text-center text-gray-600" style={{ lineHeight: '14px', fontSize: '18px', letterSpacing: '2%' }}>
                            {t('Properties.Reservation.pricing.group.no-selection-2')}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default GroupPricingStep