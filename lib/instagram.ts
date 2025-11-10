const GRAPH_API_BASE = 'https://graph.facebook.com/v19.0';

export interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
  instagram_business_account?: {
    id: string;
  };
}

export interface InstagramProfile {
  id: string;
  name: string;
  username: string;
  profile_picture_url: string;
  biography: string;
  website: string;
  followers_count: number;
  follows_count: number;
  media_count: number;
}

export interface InstagramMedia {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url?: string;
  permalink: string;
  thumbnail_url?: string;
}

export interface InstagramStory {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO';
  media_url?: string;
  permalink: string;
  thumbnail_url?: string;
  timestamp?: string;
}

/**
 * Fetches the user's Facebook Pages
 */
export async function getUserPages(accessToken: string): Promise<FacebookPage[]> {
  const response = await fetch(
    `${GRAPH_API_BASE}/me/accounts?access_token=${accessToken}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to fetch Facebook Pages');
  }

  const data = await response.json();
  return data.data || [];
}

/**
 * Gets the Instagram Business Account ID from a Facebook Page
 */
export async function getInstagramAccountId(
  pageId: string,
  pageAccessToken: string
): Promise<string | null> {
  const response = await fetch(
    `${GRAPH_API_BASE}/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to fetch Instagram account');
  }

  const data = await response.json();
  return data.instagram_business_account?.id || null;
}

/**
 * Fetches Instagram profile data
 */
export async function getInstagramProfile(
  igUserId: string,
  accessToken: string
): Promise<InstagramProfile> {
  const response = await fetch(
    `${GRAPH_API_BASE}/${igUserId}?fields=id,name,username,profile_picture_url,biography,website,followers_count,follows_count,media_count&access_token=${accessToken}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to fetch Instagram profile');
  }

  return await response.json();
}

/**
 * Fetches Instagram media (posts)
 */
export async function getInstagramMedia(
  igUserId: string,
  accessToken: string,
  limit: number = 12
): Promise<InstagramMedia[]> {
  const response = await fetch(
    `${GRAPH_API_BASE}/${igUserId}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url&limit=${limit}&access_token=${accessToken}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to fetch Instagram media');
  }

  const data = await response.json();
  return data.data || [];
}

/**
 * Fetches Instagram Stories
 */
export async function getInstagramStories(
  igUserId: string,
  accessToken: string
): Promise<InstagramStory[]> {
  // First, get the list of story IDs
  const storiesResponse = await fetch(
    `${GRAPH_API_BASE}/${igUserId}/stories?access_token=${accessToken}`
  );

  if (!storiesResponse.ok) {
    const error = await storiesResponse.json();
    throw new Error(error.error?.message || 'Failed to fetch Instagram stories');
  }

  const storiesData = await storiesResponse.json();
  const storyIds = storiesData.data || [];

  if (storyIds.length === 0) {
    return [];
  }

  // Fetch details for each story
  // The stories endpoint returns IDs, so we need to fetch each story's details
  const storyDetails = await Promise.all(
    storyIds.map(async (story: { id: string }) => {
      const detailResponse = await fetch(
        `${GRAPH_API_BASE}/${story.id}?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${accessToken}`
      );

      if (!detailResponse.ok) {
        // If a story is no longer available (expired), skip it
        return null;
      }

      return await detailResponse.json();
    })
  );

  // Filter out null values (expired stories)
  return storyDetails.filter((story): story is InstagramStory => story !== null);
}

/**
 * Finds the Instagram Business Account from user's Facebook Pages
 */
export async function findInstagramAccount(
  userAccessToken: string
): Promise<{ igUserId: string; pageAccessToken: string } | null> {
  const pages = await getUserPages(userAccessToken);

  for (const page of pages) {
    const igUserId = await getInstagramAccountId(page.id, page.access_token);
    if (igUserId) {
      return {
        igUserId,
        pageAccessToken: page.access_token,
      };
    }
  }

  return null;
}

