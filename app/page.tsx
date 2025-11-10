import Link from 'next/link';

export default function Home() {
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
          
          <Link
            href="/api/auth/instagram"
            className="inline-block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Connect Instagram
          </Link>

          <p className="text-xs text-gray-500 mt-6">
            You&apos;ll be redirected to Facebook to authorize this app.
          </p>
        </div>
      </main>
    </div>
  );
}
