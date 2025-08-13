'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function SignInPage() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}
    >
      <button
        onClick={toggleDarkMode}
        className={`absolute top-4 right-4 p-2 rounded-full ${
          darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'
        }`}
        aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>

      <div
        className={`w-full max-w-md p-8 rounded-lg shadow-md ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className={`block text-sm font-medium mb-1 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="text"
              required
              className={`w-full px-3 py-2 border rounded-md ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 focus:border-blue-500'
                  : 'bg-white border-gray-300 focus:border-blue-500'
              }`}
              autoComplete="email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className={`block text-sm font-medium mb-1 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className={`w-full px-3 py-2 border rounded-md ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 focus:border-blue-500'
                  : 'bg-white border-gray-300 focus:border-blue-500'
              }`}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-md font-medium ${
              darkMode
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              darkMode ? 'focus:ring-offset-gray-800' : ''
            }`}
          >
            Sign In
          </button>
        </form>

        <div
          className={`mt-4 text-center text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Don&#39;t have an account?{' '}
          <a
            href="#"
            className={`font-medium ${
              darkMode
                ? 'text-blue-400 hover:text-blue-300'
                : 'text-blue-600 hover:text-blue-500'
            }`}
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
