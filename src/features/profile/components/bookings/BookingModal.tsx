import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoTab, PaymentTab } from "./Tabs";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  activeTab: 'info' | 'payment';
  setActiveTab: (tab: 'info' | 'payment') => void;
  isRTL: boolean;
}

export default function BookingModal({
  isOpen,
  onClose,
  booking,
  activeTab,
  setActiveTab,
  isRTL,
}: BookingModalProps) {
  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-5xl max-h-[95vh] overflow-hidden p-0 rounded-3xl"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b flex flex-row items-start justify-between">
          <div>
            <DialogTitle className="text-2xl font-semibold text-left">
              {booking.title}
            </DialogTitle>
            <p className={`mt-1 inline-block px-4 py-1 rounded-full text-sm font-medium ${booking.statusColor}`}>
              {booking.status}
            </p>
          </div>
        </DialogHeader>

        {/* Tabs */}
        <div className="px-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'info' | 'payment')}>
            <TabsList className="w-full grid grid-cols-2 bg-gray-100 rounded-xl p-1 h-12">
              <TabsTrigger 
                value="info"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium"
              >
                Info
              </TabsTrigger>
              <TabsTrigger 
                value="payment"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium"
              >
                Payment
              </TabsTrigger>
            </TabsList>

            {/* Info Tab */}
            <TabsContent value="info" className="mt-6 px-1 pb-6 space-y-8 overflow-auto max-h-[calc(95vh-180px)]">
              <InfoTab booking={booking} />
            </TabsContent>

            {/* Payment Tab */}
            <TabsContent value="payment" className="mt-6 px-1 pb-6 overflow-auto max-h-[calc(95vh-180px)]">
              <PaymentTab booking={booking} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}