import { useMutation } from '@tanstack/react-query';
import { profileApi } from '../profileApi'; // adjust path as needed
import { toast } from 'sonner';
import { clearCredentials } from '@/store/slices/authSlice';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ApiError } from '@/common/api/commonApi';
import { useNavigate } from 'react-router-dom';

export const useDeleteAccount = () => {
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: () => profileApi.deleteUserAccount(),

        onSuccess: () => {
            navigate("/", {state: {isLoginError: false}})
            setTimeout(() => {
                dispatch(clearCredentials())
            }, 500)
            toast.success(t('Account.Profile.DeleteAccount.success'));
        },

        onError: (error: unknown) => {
            const errorMessage =
                (error as ApiError)?.response?.data?.message ||
                (error as Error)?.message ||
                'Failed to delete account';

            toast.error(t('Account.Profile.DeleteAccount.fail', {error: errorMessage}));
        },
    });
};