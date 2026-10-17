'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import {
  CalendarDays,
  ChevronRight,
  Compass,
  Heart,
  LogIn,
  LogOut,
  Mail,
  Phone,
  Save,
  Search,
  ShieldCheck,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import authService from '@/services/authService';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import FormField, { SubmitButton, primaryButtonClass } from '@/components/account/FormField';
import { cn } from '@/lib/utils';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const profileSchema = z.object({
  name: z.string().trim().min(1, 'Full name is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  phone: z
    .string()
    .trim()
    .refine((v) => !v || /^\+?[\d\s-]{7,15}$/.test(v), 'Enter a valid phone number'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const breadcrumbs = [{ label: 'Home', href: '/' }, { label: 'Profile' }];

function formatMemberSince(date?: string) {
  if (!date) return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateProfile, logout, isAuthenticated, loading: authLoading } = useAuth();
  const [fetching, setFetching] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', email: '', phone: '' },
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    const fetchProfile = async () => {
      try {
        const response = await authService.getProfile();
        if (!cancelled && response.success && response.data) {
          const userData = response.data;
          reset({ name: userData.name || '', email: userData.email || '', phone: userData.phone || '' });
        }
      } catch (error) {
        console.error('Failed to fetch profile', error);
        // Fall back to the cached user so the form isn't empty.
        if (!cancelled && user) reset({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
      } finally {
        if (!cancelled) setFetching(false);
      }
    };
    fetchProfile();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile({ name: data.name, email: data.email, phone: data.phone });
      reset(data);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Signed out');
    router.push('/');
  };

  const firstName = user?.name?.split(' ')[0];
  const memberSince = formatMemberSince(user?.createdAt);
  const favoritesCount = user?.favorites?.length || 0;

  const quickLinks = [
    { href: '/favorites', label: 'My favorites', sub: `${favoritesCount} saved place${favoritesCount !== 1 ? 's' : ''}`, icon: Heart },
    { href: '/places', label: 'Explore places', sub: 'Browse all destinations', icon: Compass },
    { href: '/search', label: 'Search', sub: 'Find by state or category', icon: Search },
  ];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <PageHeader
        eyebrow="Account"
        title={
          isAuthenticated && firstName ? (
            <>Hello, <em className="italic text-orange-300">{firstName}</em></>
          ) : (
            'My Profile'
          )
        }
        description="Manage your personal details and saved places."
        breadcrumbs={breadcrumbs}
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        {authLoading ? (
          <ProfileSkeleton />
        ) : !isAuthenticated ? (
          <EmptyState
            icon={UserIcon}
            title="Sign in to view your profile"
            description="Manage your details, keep track of favorite places and more."
            action={
              <Link href="/auth/login" className={primaryButtonClass}>
                <LogIn className="h-4 w-4" />
                Sign in
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
            {/* Account card */}
            <motion.aside
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
              className="space-y-6 lg:col-span-1"
            >
              <div className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white dark:border-stone-800 dark:bg-stone-900">
                <div className="h-20 bg-gradient-to-r from-orange-500 to-rose-500" />
                <div className="-mt-10 px-6 pb-6 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-rose-500 font-display text-3xl font-semibold text-white shadow-lg shadow-orange-500/30 ring-4 ring-white dark:ring-stone-900">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-stone-900 dark:text-white">
                    {user?.name}
                  </h2>
                  <p className="mt-1 truncate text-sm text-stone-500 dark:text-stone-400">{user?.email}</p>
                  <span
                    className={cn(
                      'mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize',
                      user?.role === 'admin'
                        ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300'
                        : 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300'
                    )}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {user?.role === 'admin' ? 'Administrator' : 'Traveler'}
                  </span>

                  <dl className="mt-6 grid grid-cols-2 divide-x divide-stone-100 rounded-2xl bg-stone-50 py-3 dark:divide-stone-800 dark:bg-stone-800/50">
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-stone-400">Favorites</dt>
                      <dd className="mt-0.5 font-display text-xl font-semibold text-stone-900 dark:text-white">{favoritesCount}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-stone-400">Member since</dt>
                      <dd className="mt-1 flex items-center justify-center gap-1 text-sm font-medium text-stone-700 dark:text-stone-300">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {memberSince ?? '—'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <nav aria-label="Quick links" className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white dark:border-stone-800 dark:bg-stone-900">
                <ul className="divide-y divide-stone-100 dark:divide-stone-800">
                  {quickLinks.map(({ href, label, sub, icon: Icon }) => (
                    <li key={href}>
                      <Link href={href} className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/60">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-950/40">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-medium text-stone-900 dark:text-white">{label}</span>
                          <span className="block truncate text-sm text-stone-500 dark:text-stone-400">{sub}</span>
                        </span>
                        <ChevronRight className="h-4 w-4 text-stone-300 transition-transform group-hover:translate-x-0.5 group-hover:text-stone-500" />
                      </Link>
                    </li>
                  ))}
                  <li>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500 dark:bg-rose-950/40">
                        <LogOut className="h-5 w-5" />
                      </span>
                      <span className="font-medium text-rose-600 dark:text-rose-400">Sign out</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </motion.aside>

            {/* Edit form */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease: EASE_OUT }}
              className="lg:col-span-2"
            >
              <div className="rounded-3xl border border-stone-200/80 bg-white p-6 sm:p-8 dark:border-stone-800 dark:bg-stone-900">
                <div className="mb-8">
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-stone-900 dark:text-white">
                    Personal details
                  </h2>
                  <p className="mt-1 text-stone-500 dark:text-stone-400">
                    Keep your information up to date so we can personalise your experience.
                  </p>
                </div>

                {fetching ? (
                  <div className="space-y-6">
                    {[0, 1, 2].map((i) => (
                      <div key={i}>
                        <div className="mb-2 h-4 w-24 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
                        <div className="h-12 animate-pulse rounded-xl bg-stone-100 dark:bg-stone-800/70" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                    <FormField
                      label="Full name"
                      icon={UserIcon}
                      autoComplete="name"
                      placeholder="Your name"
                      error={errors.name?.message}
                      {...register('name')}
                    />
                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        label="Email address"
                        icon={Mail}
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        error={errors.email?.message}
                        {...register('email')}
                      />
                      <FormField
                        label="Phone"
                        labelAside={<span className="text-xs text-stone-400">Optional</span>}
                        icon={Phone}
                        type="tel"
                        autoComplete="tel"
                        placeholder="+91 98765 43210"
                        error={errors.phone?.message}
                        {...register('phone')}
                      />
                    </div>

                    <div className="flex flex-col-reverse gap-3 border-t border-stone-100 pt-6 sm:flex-row sm:items-center sm:justify-end dark:border-stone-800">
                      {isDirty && (
                        <button
                          type="button"
                          onClick={() => reset()}
                          disabled={isSubmitting}
                          className="inline-flex h-12 items-center justify-center rounded-xl px-5 font-semibold text-stone-600 transition-colors hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
                        >
                          Discard changes
                        </button>
                      )}
                      <SubmitButton loading={isSubmitting} loadingLabel="Saving..." disabled={!isDirty}>
                        <Save className="h-4 w-4" />
                        Save changes
                      </SubmitButton>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </section>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
      <div className="h-80 animate-pulse rounded-3xl bg-stone-200/70 dark:bg-stone-800" />
      <div className="h-96 animate-pulse rounded-3xl bg-stone-200/70 lg:col-span-2 dark:bg-stone-800" />
    </div>
  );
}
