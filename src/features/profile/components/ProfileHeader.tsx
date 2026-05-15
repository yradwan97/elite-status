import { OptimizedImage } from '@/components/shared/OptimizedImage';
import { useUser } from '@/features/auth/api/hooks/useUser';
import { isPlanActive } from '@/lib/utils';
import { RootState } from '@/store';
import i18next from 'i18next';
import { Menu } from 'lucide-react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

interface Props {
  onMenuClick: () => void;
}

export default function ProfileHeader({ onMenuClick }: Props) {

  const user = useSelector((state: RootState) => state.auth.user);
  const isArabic = i18next.language === "ar"
  const { refetch } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    refetch()
  }, [refetch])

  const getInitials = (firstName: string, lastName: string) => {
    const firstNames = firstName.split(' ');
    const lastNames = lastName.split(' ');
    const initials = [...firstNames, ...lastNames].map(n => n.charAt(0)).join('');
    return initials.toUpperCase();
  }

  return (
    <div className="rounded-lg bg-white shadow-lg px-4 lg:px-6 h-36 flex min-w-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3">

            {user?.image ? (
              <OptimizedImage src={user.image as string} alt='user-image' className='size-14' />
            ) : (
              <div className="h-10 w-10 bg-navy rounded-full flex items-center justify-center text-white text-xl font-bold">
                {getInitials(user?.firstName || '', user?.lastName || '')}
              </div>)}
            <div>
              <div className="font-semibold text-2xl text-navy">{user?.firstName} {user?.lastName}</div>
              {user?.plan && isPlanActive(user?.plan) && (
                <span
                  onClick={() => navigate("/account", { state: { page: "price-plan" } })}
                  className="text-sm text-emerald-600 font-medium underline cursor-pointer"
                >
                  {isArabic ? user.plan.titleAr : user.plan.titleEn}
                </span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}