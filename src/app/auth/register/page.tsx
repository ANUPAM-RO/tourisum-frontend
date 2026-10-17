'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Mail, Phone, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import AuthShell from '@/components/account/AuthShell';
import FormField, { SubmitButton } from '@/components/account/FormField';

const registerSchema = z.object({
  name: z.string().trim().min(1, 'Full name is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || /^\+?[\d\s-]{7,15}$/.test(v), 'Enter a valid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterSchemaData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterSchemaData) => {
    setLoading(true);
    try {
      await register(data.name, data.email, data.password, data.phone || undefined);
      toast.success('Welcome aboard! Your account is ready.');
      router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <AuthShell
      image="https://images.unsplash.com/photo-1564507592333-c60657eea523"
      imageCaption="Taj Mahal, Agra"
      tagline={<>Explore <em className="italic text-orange-300">Incredible</em> India</>}
      taglineSub="Create a free account to save favourite places, plan trips and discover hidden gems across 28 states."
      title="Create your account"
      subtitle="It only takes a minute — and it's free."
      footer={
        <>
          Already have an account?{' '}
          <Link href="/auth/login" className="font-semibold text-orange-600 transition-colors hover:text-rose-600 dark:text-orange-400">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <FormField
          label="Full name"
          icon={User}
          autoComplete="name"
          placeholder="Your name"
          error={errors.name?.message}
          {...formRegister('name')}
        />
        <FormField
          label="Email address"
          icon={Mail}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...formRegister('email')}
        />
        <FormField
          label="Phone"
          labelAside={<span className="text-xs text-stone-400">Optional</span>}
          icon={Phone}
          type="tel"
          autoComplete="tel"
          placeholder="+91 98765 43210"
          error={errors.phone?.message}
          {...formRegister('phone')}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label="Password"
            icon={Lock}
            passwordToggle
            autoComplete="new-password"
            placeholder="Min. 6 characters"
            error={errors.password?.message}
            {...formRegister('password')}
          />
          <FormField
            label="Confirm password"
            icon={Lock}
            passwordToggle
            autoComplete="new-password"
            placeholder="Repeat password"
            error={errors.confirmPassword?.message}
            {...formRegister('confirmPassword')}
          />
        </div>
        <SubmitButton loading={loading} loadingLabel="Creating account..." className="w-full">
          Create account
          <ArrowRight className="h-4 w-4" />
        </SubmitButton>
        <p className="text-center text-xs text-stone-400">
          By signing up you agree to our terms and privacy policy.
        </p>
      </form>
    </AuthShell>
  );
}
