import { useMutation } from '@tanstack/react-query';
import { profileApi } from '../profileApi'; // adjust path as needed
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export type ChangePasswordData = {
    currentPassword: string;
    newPassword: string;
};

export const useChangePassword = () => {
    const {t} = useTranslation();
    return useMutation({
        mutationFn: (data: ChangePasswordData) => profileApi.changePassword(data),

        onSuccess: () => {
            toast.success(t('Account.Profile.ChangePasswordSuccess'));
        },

        onError: (error: unknown) => {
            const errorMessage =
                (error as any)?.response?.data?.message ||
                (error as Error)?.message ||
                'Failed to change password';

            toast.error(errorMessage);
        },
    });
};