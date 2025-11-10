import Image from 'next/image';

interface ProfileCardProps {
  profile: {
    name: string;
    username: string;
    profile_picture_url: string;
    biography: string;
    website: string;
    followers_count: number;
    follows_count: number;
    media_count: number;
  };
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Profile Picture */}
        <div className="flex-shrink-0">
          <Image
            src={profile.profile_picture_url}
            alt={`${profile.name}'s profile picture`}
            width={120}
            height={120}
            className="rounded-full object-cover"
            unoptimized
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {profile.name}
          </h1>
          <p className="text-gray-600 mb-3">@{profile.username}</p>

          {profile.biography && (
            <p className="text-gray-700 mb-3">{profile.biography}</p>
          )}

          {profile.website && (
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block"
            >
              {profile.website}
            </a>
          )}

          {/* Stats */}
          <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {profile.followers_count.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {profile.follows_count.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Following</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {profile.media_count.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Posts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

