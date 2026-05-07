import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import InputField from '@/components/shared/InputField';
import loginLogo from '@/assets/login-icon.png';
import { OptimizedImage } from '@/components/shared/OptimizedImage';
import { PageTitle } from '@/components/shared/PageTitle';
import { useResetPassword } from './api/hooks/useResetPassword';

const getResetPasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      newPassword: z
        .string()
        .min(8, t('Auth.validation.passwordMin') ?? 'At least 8 characters'),
      confirmPassword: z
        .string()
        .min(1, t('Auth.validation.required') ?? 'Required'),
    })
    .refine((d) => d.newPassword === d.confirmPassword, {
      message: t('Auth.validation.passwordMatch') ?? 'Passwords do not match',
      path: ['confirmPassword'],
    });

type FormValues = z.infer<ReturnType<typeof getResetPasswordSchema>>;

const ResetPassword = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate()

  const schema = getResetPasswordSchema(t);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const resetPassword = useResetPassword()

  const onSubmit = async (data: FormValues) => {
    if (!token) return;
    resetPassword.mutate({
        token,
        password: data.newPassword
    }, {
        onSettled: () => {
            navigate("/", {state: {openLoginModal: true}})
        }
    })
    
  };

  if (!token) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className='border py-24 px-36 shadow-md rounded-md'>
          <p className="text-red-500 text-sm">{t('Auth.resetPassword.invalidLink')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
        <PageTitle titleKey='Auth.Reset' />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
    
              <div className="w-full flex items-center justify-center">
                <OptimizedImage src={loginLogo} alt="login-logo" className="w-16 h-16" />
              </div>
    
              <h2 className="text-2xl font-semibold text-center my-4">
                {t('Auth.resetPassword.title')}
              </h2>
    
              <InputField
                name="newPassword"
                register={register}
                placeholder={t('Auth.resetPassword.newPasswordPlaceholder')}
                isPassword
                error={errors.newPassword?.message}
              />
    
              <InputField
                name="confirmPassword"
                register={register}
                placeholder={t('Auth.resetPassword.confirmPasswordPlaceholder')}
                isPassword
                error={errors.confirmPassword?.message}
              />
    
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-navy text-white py-3 text-lg rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? t('Auth.resetPassword.submitting')
                  : t('Auth.resetPassword.submit')}
              </button>
    
            </form>
          </div>
        </div>
    </>
  );
};

export default ResetPassword;