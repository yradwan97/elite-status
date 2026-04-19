import { User, Calendar, CreditCard, Heart, LogOut, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type TabId = 'profile' | 'booking' | 'price-plan' | 'favourite';

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ activeTab, onTabChange, isMobile = false, onClose }: SidebarProps) {
  const { t } = useTranslation();

  const tabsConfig = [
    { id: 'profile' as TabId, icon: User, key: "Account.Sidebar.MyProfile" },
    { id: 'booking' as TabId, icon: Calendar, key: "Account.Sidebar.MyBooking" },
    { id: 'price-plan' as TabId, icon: CreditCard, key: "Account.Sidebar.MyPricePlan" },
    { id: 'favourite' as TabId, icon: Heart, key: "Account.Sidebar.MyFavourite" },
  ];

  return (
    <div className={`w-full h-full bg-white border-r flex flex-col`}>
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
                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-left transition-all ${isActive ? 'bg-navy text-white' : 'hover:bg-gray-100 text-gray-700'
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
        <button className="w-full flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-100 rounded-2xl">
          <LogOut className="w-5 h-5" />
          <span>{t("Account.Sidebar.Logout")}</span>
        </button>

        <button className="w-full flex items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-50 rounded-2xl">
          <Trash2 className="w-5 h-5" />
          <span>{t("Account.Sidebar.DeleteAccount")}</span>
        </button>
      </div>
    </div>
  );
}