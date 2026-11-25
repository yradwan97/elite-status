import { GroupChalet } from '../../../api/propertiesApi'
import { OptimizedImage } from '@/components/shared/OptimizedImage'
import i18next, { t } from 'i18next'
import chaletIcon from '@/assets/chalet-icon.png'
import { useIsMobile } from '@/hooks/use-mobile'

type GroupUnitCardProps = {
    unit: GroupChalet
    onSelect?: () => void
    isSelected?: boolean
}

const GroupUnitCard = ({ unit, onSelect, isSelected = false }: GroupUnitCardProps) => {
    const isRTL = i18next.language === 'ar'
    const name = isRTL ? unit.nameAr : unit.nameEn
    const [first = '', second = ''] = name.split(' ')
    const isMobile = useIsMobile()

    return isMobile ? (
        <div
            onClick={onSelect}
            className="flex flex-col items-center w-full min-w-0 cursor-pointer"
        >
            <p
                className={`whitespace-nowrap leading-none mb-1 ${unit.isDailyRentAllowed ? '' : 'text-transparent'}`}
                style={{ fontSize: 'clamp(6px, 2vw, 9px)' }}
            >
                {t('General.daily')}
            </p>
            <div
                className={`flex flex-col h-11.5 items-center w-full rounded-md py-2 transition-colors duration-200 ${isSelected ? 'bg-[#D4A829]' : 'bg-turquoise'}`}
            >
                <span className="text-white font-normal leading-none" style={{ fontSize: 'clamp(9px, 2.8vw, 13px)' }}>
                    {second ? first[0] : ''}
                </span>
                <hr className="border-white/70 w-3/4 my-1" />
                <span className="text-white font-normal leading-none whitespace-nowrap" style={{ fontSize: 'clamp(9px, 2.8vw, 13px)' }}>
                    {second || first}
                </span>
            </div>
        </div>
    )
        : (
            <div
                onClick={onSelect}
                className="flex flex-col items-center w-full min-w-0 cursor-pointer transition-colors duration-200"
            >
                <p
                    className={`whitespace-nowrap ${unit.isDailyRentAllowed ? '' : 'text-transparent'}`}
                    style={{ fontSize: 'clamp(8px, 1.3vw, 14px)' }}
                >
                    {t("General.daily")}
                </p>
                <div className={`flex flex-col items-center w-full min-w-0 px-0.5 ${isSelected ? 'bg-[#D4A829]' : 'bg-transparent'}`}>
                    <OptimizedImage
                        src={chaletIcon}
                        alt={name}
                        className="w-full max-w-16 h-auto aspect-square"
                    />
                    <span
                        className={`mt-1 md:mt-2 py-1 px-1 md:px-2 lg:px-3 rounded-md font-normal whitespace-nowrap transition-colors duration-200 ${isSelected ? 'bg-[#14194D] text-white' : 'bg-white text-black'}`}
                        style={{ fontSize: 'clamp(9px, 1.4vw, 14px)' }}
                    >
                        {`${first[0]} ${second}`}
                    </span>
                </div>
            </div>
        )
}

export default GroupUnitCard