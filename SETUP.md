# Instagram Graph API PoC - Setup Instructions

This guide will walk you through setting up the Instagram Graph API integration for this Next.js application.

## Prerequisites

- A Facebook Developer Account
- A Facebook Business Page
- A Professional Instagram Account (Business or Creator) linked to your Facebook Page
- Node.js 18+ installed

## Step 1: Create a Facebook App

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Sign in with your Facebook account
3. Click **"My Apps"** in the top right, then **"Create App"**
4. Select **"Business"** as the app type and click **"Next"**
5. Fill in the required information:
   - **App Name**: Choose a name (e.g., "Instagram Graph API PoC")
   - **App Contact Email**: Your email address
6. Click **"Create App"**

## Step 2: Add Products to Your App

1. In your app dashboard, go to **"Add Products"** or find the **"Products"** section
2. Add the following products:
   - **Facebook Login**: Click "Set Up"
   - **Instagram Graph API**: Click "Set Up"
   - **Pages API**: Usually added automatically with Facebook Login

## Step 3: Configure Facebook Login

1. In the left sidebar, navigate to **"Facebook Login" > "Settings"**
2. Enable the following:
   - ✅ **Client OAuth Login**
   - ✅ **Web OAuth Login**
3. Add your **Valid OAuth Redirect URIs**:
   - For local development: `http://localhost:3000/api/auth/callback`
   - For production: `https://yourdomain.com/api/auth/callback`
4. Click **"Save Changes"**

## Step 4: Request Required Permissions

1. Navigate to **"App Review" > "Permissions and Features"**
2. Request the following permissions:
   - `instagram_basic` - Access basic Instagram profile information
   - `pages_show_list` - See the list of Pages you manage
   - `pages_read_engagement` - Read engagement data for Pages you manage

### Note on App Review

For production use, you'll need to submit your app for review with these permissions. However, for development/testing:

- If you're the admin of the app, you can use it with your own account immediately
- For testing with other users, add them as **Test Users** or **Administrators** in **"Roles" > "People"**

## Step 5: Link Instagram Account to Facebook Page

Before using this app, ensure your Instagram account is properly linked:

1. Go to your **Facebook Page** (must be a Business Page)
2. Navigate to **Settings** > **Linked Accounts** (or **Instagram** section)
3. Connect your Instagram Business or Creator account
4. Make sure you're an admin of both the Page and the Instagram account

## Step 6: Get Your App Credentials

1. In your app dashboard, go to **"Settings" > "Basic"**
2. Note down the following:
   - **App ID**: Your Facebook App ID
   - **App Secret**: Click "Show" next to App Secret to reveal it

## Step 7: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local` (if it exists, or create one)
2. Create a `.env.local` file in the root of your project with the following:

```env
FACEBOOK_APP_ID=your_facebook_app_id_here
FACEBOOK_APP_SECRET=your_facebook_app_secret_here

NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/api/auth/callback
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

3. Replace the placeholder values with your actual App ID and App Secret
4. For production, update the URLs to match your domain

## Step 8: Install Dependencies and Run

```bash
# Install dependencies (if not already done)
npm install

# Run the development server
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser
6. Click "Connect Instagram" to test the integration

## Troubleshooting

### "No Instagram Business Account found"

- Ensure your Instagram account is a **Business** or **Creator** account
- Verify the account is linked to your Facebook Page
- Make sure you have admin access to both the Page and Instagram account

### OAuth Redirect URI Mismatch

- Verify the redirect URI in your `.env.local` matches exactly with what you configured in Facebook App settings
- Check for trailing slashes or protocol differences (http vs https)

### "Invalid App ID" or Authentication Errors

- Double-check your `FACEBOOK_APP_ID` and `FACEBOOK_APP_SECRET` in `.env.local`
- Ensure you've restarted the Next.js dev server after changing environment variables
- Verify the app is in "Development" mode (if testing) and you're added as a user

### Token Expiration

Access tokens typically expire after 60 days. The app stores the token in cookies. If you encounter authentication errors, you may need to reconnect your account.

## API Endpoints Used

The app uses the following Instagram Graph API endpoints:

- `GET /me/accounts` - Get user's Facebook Pages
- `GET /{page-id}` - Get Instagram Business Account linked to a Page
- `GET /{ig-user-id}` - Get Instagram profile information
- `GET /{ig-user-id}/media` - Get Instagram media (posts)

## Resources

- [Instagram Graph API Documentation](https://developers.facebook.com/docs/instagram-api/)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login/)
- [Meta for Developers Portal](https://developers.facebook.com/)

