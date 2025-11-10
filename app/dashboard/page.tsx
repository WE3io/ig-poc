'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfileCard from '../components/ProfileCard';
import MediaGallery from '../components/MediaGallery';

interface Profile {
  name: string;
  username: string;
  profile_picture_url: string;
  biography: string;
  website: string;
  followers_count: number;
  follows_count: number;
  media_count: number;
}

interface MediaItem {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url?: string;
  permalink: string;
  thumbnail_url?: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch profile
      const profileResponse = await fetch('/api/profile');
      if (!profileResponse.ok) {
        if (profileResponse.status === 401) {
          router.push('/?error=not_authenticated');
          return;
        }
        const errorData = await profileResponse.json();
        throw new Error(errorData.error || 'Failed to fetch profile');
      }
      const profileData = await profileResponse.json();
      setProfile(profileData);

      // Fetch media
      const mediaResponse = await fetch('/api/media?limit=12');
      if (!mediaResponse.ok) {
        const errorData = await mediaResponse.json();
        throw new Error(errorData.error || 'Failed to fetch media');
      }
      const mediaData = await mediaResponse.json();
      setMedia(mediaData);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600">Loading your Instagram data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={fetchData}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 mr-4"
          >
            Retry
          </button>
          <button
            onClick={() => router.push('/')}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={() => router.push('/')}
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            Connect Another Account
          </button>
        </div>

        {/* Profile */}
        {profile && <ProfileCard profile={profile} />}

        {/* Media Gallery */}
        <MediaGallery media={media} />
      </div>
    </div>
  );
}

