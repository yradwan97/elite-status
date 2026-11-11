import { Bed, LayoutSection, Room } from '../api/propertiesApi'
import i18next, { t } from 'i18next'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import roomIcon from '@/assets/room.svg'
import bunkBedIcon from '@/assets/bunk-beds.png'
import doubleBedIcon from '@/assets/double-beds.png'
import singleBedIcon from '@/assets/single-bed.png'

const ChaletGroupRoomCard = ({ room }: { room: LayoutSection }) => {
    const isRTL = i18next.language === 'ar';

    const getBedsLabel = (beds: Bed[]) =>
        beds
            .map((bed) => `${bed.count} ${t(`General.${bed.bedType}`)}`)
            .join(' + ');

    const getBedTypeIcon = (bedType: Bed['bedType']) => {
        switch (bedType) {
            case 'BUNK':
                return bunkBedIcon;
            case 'DOUBLE':
                return doubleBedIcon;
            case 'SINGLE':
                return singleBedIcon;
            default:
                return '';
        }
    }

    const getRoomType = (subRoom: Room) =>
        isRTL ? subRoom.roomTypeAr : subRoom.roomTypeEn;

    return (
        <div className="flex flex-col border-s-2 bg-white p-2.5 rounded-md gap-2" style={{ borderInlineStartColor: room.color }}>
            <div className="flex justify-between">
                <div className="flex items-center gap-1.25">
                    <div className="size-2.5 rounded-[3px]" style={{ backgroundColor: room.color }} />
                    <p className="text-sm text-gray-600" style={{ fontWeight: '500' }}>
                        {isRTL ? room.nameAr : room.nameEn}
                    </p>
                </div>
                <div
                    style={{ fontWeight: '400', fontSize: '12px', backgroundColor: room.color }}
                    className="flex py-1.25 px-2.5 items-center w-18 h-6 justify-center rounded-sm mt-1 text-white text-sm"
                >
                    {room.rooms.length} {room.rooms.length > 1 ? t("General.rooms") : t("General.room")}
                </div>
            </div>

            <div className="flex flex-col gap-1">
                {room.rooms.map((subRoom, index) => (
                    <div key={`${subRoom.roomNumber}-${index}`} className="flex flex-col justify-start border px-2.5 py-1.25 rounded-[10px]">
                        <div className="flex items-center gap-1.25 mb-1">
                            <img src={roomIcon} alt={getRoomType(subRoom)} className="size-5.5" />
                            <p className="text-xs text-gray-500" style={{ fontWeight: '400', letterSpacing: '2%', lineHeight: '100%', fontSize: '14px' }}>
                                {t("General.room")} {subRoom.roomNumber}
                            </p>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <p className="text-xs text-gray-500" style={{ fontWeight: '400', letterSpacing: '0', lineHeight: '100%', fontSize: '12px' }}>
                                    {getRoomType(subRoom)}
                                </p>
                                {isRTL
                                    ? <ArrowLeft className="size-4 -translate-y-0.5 mx-1" color="#78A9B7" />
                                    : <ArrowRight className="size-4 -translate-y-0.5 mx-1" color="#78A9B7" />}
                                <p className="text-xs text-gray-500" style={{ fontWeight: '400', letterSpacing: '0', lineHeight: '100%', fontSize: '12px' }}>
                                    {getBedsLabel(subRoom.beds)}
                                </p>
                            </div>
                            <div className="flex items-center gap-1">
                                {subRoom.beds.map((bed, i) => (
                                    <img
                                        key={`${bed.bedType}-${i}`}
                                        src={getBedTypeIcon(bed.bedType)}
                                        alt={`${bed.bedType} bed icon`}
                                        className={bed.bedType === 'DOUBLE' ? 'w-10' : 'size-5'}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ChaletGroupRoomCard