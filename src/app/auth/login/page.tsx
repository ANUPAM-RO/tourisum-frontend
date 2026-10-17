'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import AuthShell from '@/components/account/AuthShell';
import FormField, { SubmitButton } from '@/components/account/FormField';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginSchemaData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginSchemaData) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      const stored = localStorage.getItem('user');
      const userData = stored ? JSON.parse(stored) : null;
      toast.success(userData?.name ? `Welcome back, ${userData.name.split(' ')[0]}!` : 'Login successful!');
      router.push(userData?.role === 'admin' ? '/admin' : '/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <AuthShell
      image="https://images.unsplash.com/photo-1477587458883-47145ed94245"
      imageCaption="Hawa Mahal, Jaipur"
      tagline={<>Your next <em className="italic text-orange-300">journey</em> starts here</>}
      taglineSub="Sign in to pick up where you left off — your saved places and trip ideas are waiting."
      title="Welcome back"
      subtitle="Sign in to your account to continue exploring."
      footer={
        <>
          New to India Tourism?{' '}
          <Link href="/auth/register" className="font-semibold text-orange-600 transition-colors hover:text-rose-600 dark:text-orange-400">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
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
          label="Password"
          icon={Lock}
          passwordToggle
          autoComplete="current-password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...formRegister('password')}
        />
        <SubmitButton loading={loading} loadingLabel="Signing in..." className="w-full">
          Sign in
          <ArrowRight className="h-4 w-4" />
        </SubmitButton>
      </form>
    </AuthShell>
  );
}
