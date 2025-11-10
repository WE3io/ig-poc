import MediaCard from './MediaCard';

interface StoryItem {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO';
  media_url?: string;
  permalink: string;
  thumbnail_url?: string;
  timestamp?: string;
}

interface StoriesGalleryProps {
  stories: StoryItem[];
}

export default function StoriesGallery({ stories }: StoriesGalleryProps) {
  if (stories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No active stories available.</p>
        <p className="text-sm text-gray-400 mt-2">
          Stories are only available for 24 hours after posting.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Stories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stories.map((story) => (
          <div key={story.id} className="relative">
            <MediaCard 
              media={{
                id: story.id,
                caption: story.caption,
                media_type: story.media_type,
                media_url: story.media_url,
                permalink: story.permalink,
                thumbnail_url: story.thumbnail_url,
              }} 
            />
            <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded text-xs font-semibold">
              STORY
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

