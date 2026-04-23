import { useMutation } from '@tanstack/react-query';
import { profileApi, ProfileUpdateData } from '../profileApi'; // adjust path as needed
import { toast } from 'sonner';
import { setCredentials } from '@/store/slices/authSlice';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

export const useUpdateProfile = () => {
    const dispatch = useDispatch();
    const {t} = useTranslation();

    return useMutation({
        mutationFn: (data: ProfileUpdateData) => profileApi.updateProfile(data),

        onSuccess: (data) => {
            dispatch(setCredentials({
                user: data.data,
            }));
            toast.success(t('Account.Profile.UpdateSuccess'));
        },

        onError: (error: unknown) => {
            const errorMessage =
                (error as any)?.response?.data?.message ||
                (error as Error)?.message ||
                'Failed to update profile';

            toast.error(errorMessage);
        },
    });
};