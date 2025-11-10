/**
 * Downloads a media asset (image or video) from a URL
 * Uses a proxy endpoint to avoid CORS issues
 */
export async function downloadMedia(
  url: string,
  filename: string,
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
): Promise<void> {
  try {
    // Determine file extension based on media type
    let extension = '';
    if (mediaType === 'VIDEO') {
      extension = '.mp4';
    } else {
      // Try to get extension from URL, default to jpg
      const urlLower = url.toLowerCase();
      if (urlLower.includes('.jpg') || urlLower.includes('.jpeg')) {
        extension = '.jpg';
      } else if (urlLower.includes('.png')) {
        extension = '.png';
      } else if (urlLower.includes('.webp')) {
        extension = '.webp';
      } else {
        extension = '.jpg'; // default
      }
    }

    // Use proxy endpoint to avoid CORS issues
    const proxyUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
    
    // Fetch from proxy endpoint
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error('Failed to download media');
    }

    // Create blob from response
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    // Create download link
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `${filename}${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
}

