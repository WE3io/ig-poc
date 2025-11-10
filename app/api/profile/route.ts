import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findInstagramAccount, getInstagramProfile } from '@/lib/instagram';

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

    // Find Instagram account from user's Facebook Pages
    const instagramAccount = await findInstagramAccount(accessToken);

    if (!instagramAccount) {
      return NextResponse.json(
        { error: 'No Instagram Business Account found. Please ensure your Instagram account is linked to a Facebook Page.' },
        { status: 404 }
      );
    }

    // Fetch profile data
    const profile = await getInstagramProfile(
      instagramAccount.igUserId,
      instagramAccount.pageAccessToken
    );

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

