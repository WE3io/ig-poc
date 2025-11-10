import { NextResponse } from 'next/server';

export async function GET() {
  const appId = process.env.FACEBOOK_APP_ID;
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000/api/auth/callback';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  if (!appId) {
    return NextResponse.json(
      { error: 'Facebook App ID is not configured' },
      { status: 500 }
    );
  }

  // Required scopes for Instagram Graph API
  const scopes = [
    'instagram_basic',
    'pages_show_list',
    'pages_read_engagement',
  ].join(',');

  const authUrl = new URL('https://www.facebook.com/v19.0/dialog/oauth');
  authUrl.searchParams.set('client_id', appId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', scopes);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('state', baseUrl); // Store redirect URL in state

  return NextResponse.redirect(authUrl.toString());
}

