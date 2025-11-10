'use client';

import Image from 'next/image';
import { downloadMedia } from '@/lib/download';
import { useState } from 'react';

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
  const [downloading, setDownloading] = useState(false);
  const imageUrl = media.thumbnail_url || media.media_url;
  const caption = media.caption
    ? media.caption.length > 100
      ? `${media.caption.substring(0, 100)}...`
      : media.caption
    : 'No caption';

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const downloadUrl = media.media_url || media.thumbnail_url;
    if (!downloadUrl) {
      alert('Media URL not available for download');
      return;
    }

    try {
      setDownloading(true);
      // Create a filename from the media ID or caption
      const filename = media.caption
        ? media.caption.substring(0, 50).replace(/[^a-z0-9]/gi, '_').toLowerCase()
        : `instagram_${media.id}`;
      
      await downloadMedia(downloadUrl, filename, media.media_type);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download media. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

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
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <a
        href={media.permalink}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
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
      
      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={downloading || (!media.media_url && !media.thumbnail_url)}
        className="absolute bottom-2 right-2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Download media"
        aria-label="Download media"
      >
        {downloading ? (
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        )}
      </button>
    </div>
  );
}

