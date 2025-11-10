import Image from 'next/image';

interface MediaCardProps {
  media: {
    id: string;
    caption?: string;
    media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
    media_url?: string;
    permalink: string;
    thumbnail_url?: string;
  };
}

export default function MediaCard({ media }: MediaCardProps) {
  const imageUrl = media.thumbnail_url || media.media_url;
  const caption = media.caption
    ? media.caption.length > 100
      ? `${media.caption.substring(0, 100)}...`
      : media.caption
    : 'No caption';

  if (!imageUrl) {
    return (
      <a
        href={media.permalink}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      >
        <div className="aspect-square w-full flex items-center justify-center">
          <p className="text-gray-500 text-sm">No image available</p>
        </div>
        {caption && (
          <div className="p-3">
            <p className="text-sm text-gray-700 line-clamp-2">{caption}</p>
          </div>
        )}
      </a>
    );
  }

  return (
    <a
      href={media.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative aspect-square w-full">
        <Image
          src={imageUrl}
          alt={caption}
          fill
          className="object-cover"
          unoptimized
        />
        {media.media_type === 'VIDEO' && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
            VIDEO
          </div>
        )}
        {media.media_type === 'CAROUSEL_ALBUM' && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
            CAROUSEL
          </div>
        )}
      </div>
      {caption && (
        <div className="p-3">
          <p className="text-sm text-gray-700 line-clamp-2">{caption}</p>
        </div>
      )}
    </a>
  );
}

