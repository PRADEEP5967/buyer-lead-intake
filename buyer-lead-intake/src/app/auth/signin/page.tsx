'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Google } from '@/components/icons';
import { toast } from '@/components/ui/use-toast';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    email: 'demo@example.com',
    password: 'password',
  });

  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
        callbackUrl,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      if (result?.url) {
        router.push(result.url);
      } else {
        router.push('/dashboard');
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Invalid email or password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn('google', { callbackUrl });
    } catch {
      setIsGoogleLoading(false);
      toast({
        title: 'Error',
        description: 'Error signing in with Google',
        variant: 'destructive',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Or{' '}
          <a
            href="#"
            className="font-medium text-primary hover:text-primary/80"
          >
            start your 14-day free trial
          </a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-6">
            <Button
              type="button"
              className="w-full justify-center"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isLoading}
            >
              {isGoogleLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Google className="mr-2 h-4 w-4" />
              )}
              Sign in with Google
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </Label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </Label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                disabled={isLoading || isGoogleLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  'Sign in'
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Demo credentials
                </span>
              </div>
            </div>
            <div className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
              <p>Email: demo@example.com</p>
              <p>Password: password</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}
