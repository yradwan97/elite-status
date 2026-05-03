import i18next from 'i18next';
import { useState } from 'react';
import { User, Calendar, CreditCard, Heart, LogOut, Trash2, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDeleteAccount } from '../api/hooks/useDeleteAccount';


type TabId = 'profile' | 'booking' | 'price-plan' | 'favourite';

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ activeTab, onTabChange, isMobile = false, onClose }: SidebarProps) {
  const { t } = useTranslation();
  const isArabic = i18next.language === 'ar';
  const isRTL = isArabic;

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { mutate: deleteAccount, isPending } = useDeleteAccount();

  const tabsConfig = [
    { id: 'profile'    as TabId, icon: User,       key: 'Account.Sidebar.MyProfile'    },
    { id: 'booking'    as TabId, icon: Calendar,    key: 'Account.Sidebar.MyBooking'    },
    { id: 'price-plan' as TabId, icon: CreditCard,  key: 'Account.Sidebar.MyPricePlan'  },
    { id: 'favourite'  as TabId, icon: Heart,       key: 'Account.Sidebar.MyFavourite'  },
  ];

  const handleConfirmDelete = () => {
    deleteAccount(undefined, {
      onSettled: () => setDeleteModalOpen(false),
    });
  };

  return (
    <>
      <div className="w-full h-full bg-white border-r flex flex-col">
        <div className="p-6">
          <nav className="space-y-1">
            {tabsConfig.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id);
                    if (isMobile && onClose) onClose();
                  }}
                  className={`w-full flex ${isArabic ? 'flex-row-reverse' : 'flex-row'} items-center gap-3 px-5 py-3.5 rounded-2xl text-left transition-all ${
                    isActive ? 'bg-navy text-white' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{t(tab.key)}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t p-6 space-y-2">
          <button className={`w-full flex ${isArabic ? 'flex-row-reverse' : 'flex-row'} items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-100 rounded-2xl`}>
            <LogOut className="w-5 h-5" />
            <span>{t('Account.Sidebar.Logout')}</span>
          </button>

          <button
            onClick={() => setDeleteModalOpen(true)}
            className={`w-full flex ${isArabic ? 'flex-row-reverse' : 'flex-row'} items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-50 rounded-2xl`}
          >
            <Trash2 className="w-5 h-5" />
            <span>{t('Account.Sidebar.DeleteAccount')}</span>
          </button>
        </div>
      </div>

      {/* ── Delete Account Confirmation Modal ────────────────── */}
      <Dialog open={deleteModalOpen} onOpenChange={(open) => !isPending && setDeleteModalOpen(open)}>
        <DialogContent
          className="max-w-sm p-0 rounded-3xl overflow-hidden"
          dir={isRTL ? 'rtl' : 'ltr'}
          showCloseButton={false}
        >
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className={`text-base font-semibold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('Account.Profile.DeleteAccount.title')}
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 py-5 space-y-5">
            {/* Warning banner */}
            <div className={`flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl px-4 py-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className={`text-sm text-red-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('Account.Profile.DeleteAccount.warning')}
              </p>
            </div>

            <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <button
                onClick={() => setDeleteModalOpen(false)}
                disabled={isPending}
                className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40"
              >
                {t('Account.Profile.DeleteAccount.dismiss')}
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isPending}
                className="flex-1 py-3 rounded-2xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending
                  ? t('Account.Profile.DeleteAccount.deleting')
                  : t('Account.Profile.DeleteAccount.confirm')}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}