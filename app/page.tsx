'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const loggedOut = searchParams.get('logged_out');

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/profile');
        setIsAuthenticated(response.ok);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        setIsAuthenticated(false);
        router.push('/?logged_out=true');
      } else {
        alert('Failed to logout. Please try again.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 px-4">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 px-4">
      <main className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Instagram Graph API PoC
          </h1>
          <p className="text-gray-600 mb-8">
            Connect your Professional Instagram account to view your profile and latest media.
          </p>

          {loggedOut && (
            <div className="mb-6 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              You have been logged out successfully.
            </div>
          )}

          {isAuthenticated ? (
            <div className="space-y-4">
              <Link
                href="/dashboard"
                className="inline-block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="inline-block w-full bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/api/auth/instagram"
                className="inline-block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Connect Instagram
              </Link>
              <p className="text-xs text-gray-500 mt-6">
                You&apos;ll be redirected to Facebook to authorize this app.
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 px-4">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
