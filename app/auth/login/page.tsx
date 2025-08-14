'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';
import { signIn } from 'next-auth/react';

export default function SignInPage() {
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const response = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    });

    if (response?.ok) {
      router.push('/');
    } else {
      alert('Login failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="bg-card p-8 rounded-lg shadow-sm border">
          <div className="flex items-center mb-6">
            <Link href="/" className="mr-2">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h2 className="text-2xl font-bold text-center flex-1 text-foreground">
              Sign In
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button className="w-full mt-4">Sign In</Button>
          </form>

          <div className="mt-6">
            <Button variant="outline" className="w-full gap-2">
              <GoogleIcon />
              Continue with Google
            </Button>
          </div>

          <div className="mt-6 text-center">
            <Link href="/">
              <Button variant="link" className="text-muted-foreground">
                Return to home
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&#39;t have an account?{' '}
            <Link
              href="auth/sign-up"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.8 10H12v4h5.7c-.8 2.3-3 4-5.7 4-3.3 0-6-2.7-6-6s2.7-6 6-6c1.7 0 3.2.7 4.2 1.8L19 4.2C17.1 2.4 14.7 1 12 1 5.9 1 1 5.9 1 12s4.9 11 11 11 11-4.9 11-11c0-1.3-.2-2.6-.7-3.8z" />
    </svg>
  );
}
