// src/features/account/components/ChangePasswordModal.tsx
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock } from 'lucide-react';
import InputField from '@/components/shared/InputField';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useChangePassword } from '../../api/hooks/useChangePassword'; 
import { getChangePasswordSchema } from '@/features/auth/schemas/changePasswordSchema';


type ChangePasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

// ── Component ─────────────────────────────────────────────────────────────────
interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
  const { t } = useTranslation();
  const changePasswordMutation = useChangePassword();
  const schema = getChangePasswordSchema(t);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(schema),
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: ChangePasswordFormValues) => {
    changePasswordMutation.mutate(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      { onSuccess: handleClose }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-md rounded-2xl p-8">
        <DialogHeader>
          <DialogTitle className="text-xl text-center font-semibold text-gray-800">
            {t('Account.Profile.ChangePassword') ?? 'Change Password'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-2">
          <InputField
            name="currentPassword"
            register={register}
            placeholder={t('Account.Profile.CurrentPassword') ?? 'Current Password'}
            icon={Lock}
            isPassword
            error={errors.currentPassword?.message}
          />

          <InputField
            name="newPassword"
            register={register}
            placeholder={t('Account.Profile.NewPassword') ?? 'New Password'}
            icon={Lock}
            isPassword
            error={errors.newPassword?.message}
          />

          <InputField
            name="confirmPassword"
            register={register}
            placeholder={t('Account.Profile.ConfirmNewPassword') ?? 'Confirm New Password'}
            icon={Lock}
            isPassword
            error={errors.confirmPassword?.message}
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 border rounded-2xl hover:bg-gray-50 cursor-pointer font-medium"
            >
              {t('Account.Profile.Cancel') ?? 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="px-8 py-2.5 bg-navy text-white rounded-2xl cursor-pointer hover:opacity-90 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {changePasswordMutation.isPending
                ? (t('Account.Profile.Saving') ?? 'Saving…')
                : (t('Account.Profile.SaveChanges') ?? 'Save Changes')}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}