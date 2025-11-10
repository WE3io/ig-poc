import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(
      `${state || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}?error=${error}`
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${state || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}?error=no_code`
    );
  }

  const appId = process.env.FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000/api/auth/callback';

  if (!appId || !appSecret) {
    return NextResponse.redirect(
      `${state || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}?error=config_error`
    );
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&redirect_uri=${redirectUri}&code=${code}`,
      {
        method: 'GET',
      }
    );

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      throw new Error(errorData.error?.message || 'Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      throw new Error('No access token received');
    }

    // Store access token in a cookie (in production, use httpOnly and secure flags)
    const cookieStore = await cookies();
    cookieStore.set('instagram_access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 60, // 60 days
    });

    // Redirect to dashboard
    return NextResponse.redirect(
      `${state || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard`
    );
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      `${state || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}?error=token_exchange_failed`
    );
  }
}

