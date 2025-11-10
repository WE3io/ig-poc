import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy endpoint to download Instagram media
 * This avoids CORS issues by fetching the media server-side
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mediaUrl = searchParams.get('url');
  const filename = searchParams.get('filename') || 'instagram_media';

  if (!mediaUrl) {
    return NextResponse.json(
      { error: 'Media URL is required' },
      { status: 400 }
    );
  }

  try {
    // Fetch the media from Instagram
    const response = await fetch(mediaUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch media' },
        { status: response.status }
      );
    }

    // Get the content type and determine file extension
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    let extension = '.jpg';
    
    if (contentType.includes('video')) {
      extension = '.mp4';
    } else if (contentType.includes('png')) {
      extension = '.png';
    } else if (contentType.includes('webp')) {
      extension = '.webp';
    } else if (contentType.includes('jpeg') || contentType.includes('jpg')) {
      extension = '.jpg';
    }

    // Get the blob
    const blob = await response.blob();

    // Return the file with proper headers for download
    return new NextResponse(blob, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}${extension}"`,
        'Content-Length': blob.size.toString(),
      },
    });
  } catch (error: any) {
    console.error('Download proxy error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to download media' },
      { status: 500 }
    );
  }
}

