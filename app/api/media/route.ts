import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findInstagramAccount, getInstagramMedia } from '@/lib/instagram';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('instagram_access_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated. Please connect your Instagram account.' },
        { status: 401 }
      );
    }

    // Get limit from query params (default: 12)
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '12', 10);

    // Find Instagram account from user's Facebook Pages
    const instagramAccount = await findInstagramAccount(accessToken);

    if (!instagramAccount) {
      return NextResponse.json(
        { error: 'No Instagram Business Account found. Please ensure your Instagram account is linked to a Facebook Page.' },
        { status: 404 }
      );
    }

    // Fetch media data
    const media = await getInstagramMedia(
      instagramAccount.igUserId,
      instagramAccount.pageAccessToken,
      limit
    );

    return NextResponse.json(media);
  } catch (error: any) {
    console.error('Media API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch media' },
      { status: 500 }
    );
  }
}

