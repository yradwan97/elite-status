import { RootState } from '@/store';
import { Menu } from 'lucide-react';
import { useSelector } from 'react-redux';

interface Props {
  onMenuClick: () => void;
}

export default function ProfileHeader({ onMenuClick }: Props) {

  const user = useSelector((state: RootState) => state.auth.user);

  const getInitials = (firstName: string, lastName: string) => {
    const firstNames = firstName.split(' ');
    const lastNames = lastName.split(' ');
    const initials = [...firstNames, ...lastNames].map(n => n.charAt(0)).join('');
    return initials.toUpperCase();
  }

  return (
    <div className="border-b bg-white px-4 lg:px-6 h-36 flex min-w-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3">

            {/* TODO: Replace with actual user avatar when image is added */}
            <div className="h-10 w-10 bg-navy rounded-full flex items-center justify-center text-white text-xl font-bold">
              {getInitials(user?.firstName || '', user?.lastName || '')}
            </div>
            <div>
              <div className="font-semibold text-2xl text-navy">{user?.firstName} {user?.lastName}</div>
              {/* TODO: link actual pricing plan when added to user */}
              <a href="#" className="text-sm text-emerald-600 font-medium underline">Gold Plan</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}