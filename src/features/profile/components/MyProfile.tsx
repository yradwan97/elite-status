// src/features/account/pages/AccountProfile.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getProfileSchema } from '@/features/auth/schemas/signupSchema';
import { z as zod } from 'zod';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Camera, Lock } from 'lucide-react';
import PhoneField from '@/components/shared/PhoneField';
import InputField from '@/components/shared/InputField';
import { IDUploadField } from '@/features/auth/components/IdUploadField';
import i18next from 'i18next';
import countryList from 'react-select-country-list';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUpdateProfile } from '../api/hooks/useUpdateProfile';
import { ProfileUpdateData } from '../api/profileApi';
import { OptimizedImage } from '@/components/shared/OptimizedImage';
import { ChangePasswordModal } from './profile/ChangePasswordModal';

export default function AccountProfile() {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const isArabic = i18next.language === 'ar';
  const user = useSelector((state: RootState) => state.auth.user);
  const updateProfileMutation = useUpdateProfile();

  const schema = getProfileSchema(t);
  type FormValues = zod.infer<typeof schema>;

  const countryOptions = useMemo(() => countryList().getData(), []);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    reset({
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      mobileNumber: user?.mobileNumber ?? '',
      IDFront: user?.IDFront ?? null,
      IDBack: user?.IDBack ?? null,
      terms: true,
      gender: user?.gender ?? null,
      nationality: user?.nationality ?? null,
      image: user?.image ?? null,
    });
  }, [user, reset])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const onSubmit = (data: FormValues) => {
    const updateData: ProfileUpdateData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      mobileNumber: data.mobileNumber,
      gender: data.gender,
      nationality: data.nationality,
      IDFront: data.IDFront,
      IDBack: data.IDBack,
      image: avatarFile || (typeof data.image === 'string' ? data.image : undefined),
    };

    updateProfileMutation.mutate(updateData, {
      onSuccess: () => {
        reset({ ...data, image: updateData.image ?? data.image });
        setAvatarPreview(null);
        setAvatarFile(null);
        setIsEditing(false);
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-8">
      <ChangePasswordModal
        open={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />

      {/* Avatar */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="h-24 w-24 bg-navy rounded-full flex items-center justify-center text-white text-5xl font-bold overflow-hidden">
            {avatarPreview ? (
              <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
            ) : user && user.image && typeof user.image === 'string' ? (
              <OptimizedImage alt="avatar" src={user.image} className='size-26 object-cover' />
            ) : (
              (user?.firstName?.[0] ?? 'A').toUpperCase()
            )}
          </div>
          {isEditing && (
            <label className="absolute bottom-1 right-1 h-8 w-8 bg-white rounded-full border-2 border-white flex items-center justify-center shadow cursor-pointer hover:bg-gray-100">
              <Camera className="w-4 h-4 text-gray-600" />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            name="firstName"
            register={register}
            placeholder={t('Auth.firstName')}
            error={errors.firstName?.message}
            disabled={!isEditing}
          />
          <InputField
            name="lastName"
            register={register}
            placeholder={t('Auth.lastName')}
            error={errors.lastName?.message}
            disabled={!isEditing}
          />
        </div>

        {/* Email */}
        <InputField
          name="email"
          register={register}
          placeholder={t('Auth.email')}
          error={errors.email?.message}
          disabled={!isEditing}
        />

        {/* Phone */}
        <Controller
          control={control}
          name="mobileNumber"
          render={({ field }) => <PhoneField {...field} disabled={!isEditing} />}
        />
        {errors.mobileNumber && (
          <p className="text-red-500 text-sm">{errors.mobileNumber.message}</p>
        )}

        {/* Gender & Nationality */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Gender */}
          <div className="flex flex-col gap-1">
            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <Select
                  value={field.value ?? ''}
                  onValueChange={(val) => field.onChange(val)}
                  disabled={!isEditing}
                >
                  <SelectTrigger
                    className={`
                      w-full py-3 rounded-lg border border-gray-200
                      focus:outline-none focus:ring-2 focus:ring-navy
                      pl-4 pr-4
                      ${!isEditing ? 'bg-gray-100 text-gray-500 cursor-default' : 'bg-white'}
                    `}
                    style={{ fontSize: '1.05rem', height: 'auto' }}
                  >
                    <SelectValue placeholder={t('Account.Profile.Gender.select')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t('Account.Profile.Gender.male')}</SelectItem>
                    <SelectItem value="female">{t('Account.Profile.Gender.female')}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender.message}</p>
            )}
          </div>

          {/* Nationality */}
          <div className="flex flex-col gap-1">
            <Controller
              control={control}
              name="nationality"
              render={({ field }) => (
                <Select
                  value={field.value ?? ''}
                  onValueChange={(val) => field.onChange(val)}
                  disabled={!isEditing}
                >
                  <SelectTrigger
                    className={`
                      w-full py-3 rounded-lg border border-gray-200
                      focus:outline-none focus:ring-2 focus:ring-navy
                      pl-4 pr-4
                      ${!isEditing ? 'bg-gray-100 text-gray-500 cursor-default' : 'bg-white'}
                    `}
                    style={{ fontSize: '1.05rem', height: 'auto' }}
                  >
                    <SelectValue placeholder={t('Account.Profile.Nationality')} />
                  </SelectTrigger>
                  <SelectContent>
                    {countryOptions.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.nationality && (
              <p className="text-red-500 text-sm">{errors.nationality.message}</p>
            )}
          </div>
        </div>

        {/* ID Uploads */}
        <div className="pt-4 border-t">
          <p className={`font-semibold text-gray-700 mb-3 ${isArabic ? 'text-right' : 'text-left'}`}>
            {t('Auth.idVerification') ?? 'ID Verification'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              control={control}
              name="IDFront"
              render={({ field }) => (
                <IDUploadField
                  label={t('Auth.idFront')}
                  value={field.value ?? null}
                  onChange={field.onChange}
                  error={errors.IDFront?.message as string}
                  isEditing={isEditing}
                  initialPreview={user?.IDFront ?? null}
                />
              )}
            />
            <Controller
              control={control}
              name="IDBack"
              render={({ field }) => (
                <IDUploadField
                  label={t('Auth.idBack')}
                  value={field.value ?? null}
                  onChange={field.onChange}
                  error={errors.IDBack?.message as string}
                  isEditing={isEditing}
                  initialPreview={user?.IDBack ?? null}
                />
              )}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 pt-4">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2.5 border rounded-2xl hover:bg-gray-50 cursor-pointer font-medium"
              >
                {t('Account.Profile.Cancel')}
              </button>
              <button
                type="submit"
                className="px-8 py-2.5 bg-navy text-white rounded-2xl cursor-pointer hover:opacity-90 font-medium"
              >
                {t('Account.Profile.SaveChanges')}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsChangePasswordOpen(true)}
                className="px-6 py-2.5 border border-navy text-navy rounded-2xl cursor-pointer hover:bg-navy/5 font-medium flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                {t('Account.Profile.ChangePassword') ?? 'Change Password'}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setTimeout(() => setIsEditing(true), 0);
                }}
                className="px-6 py-2.5 bg-navy text-white rounded-2xl cursor-pointer hover:opacity-90 font-medium"
              >
                {t('Account.Profile.Edit')}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}