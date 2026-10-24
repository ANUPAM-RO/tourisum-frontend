'use client';

import { useSiteSettings } from '@/lib/hooks';

/** The site name from admin settings, with the last word highlighted (e.g. "India <accent>Tourism</accent>"). */
export default function BrandName({ accentClassName }: { accentClassName: string }) {
  const { siteName } = useSiteSettings().settings;
  const split = siteName.lastIndexOf(' ');
  if (split === -1) return <>{siteName}</>;
  return (
    <>
      {siteName.slice(0, split)}
      <span className={accentClassName}>{siteName.slice(split + 1)}</span>
    </>
  );
}
