import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface PageTitleProps {
  titleKey: string;
  fallback?: string;
}

export function PageTitle({ titleKey, fallback }: PageTitleProps) {
  const { t } = useTranslation();

  return (
    <Helmet>
      <title>{t(titleKey) || fallback || 'Elite Status'}</title>
    </Helmet>
  );
}