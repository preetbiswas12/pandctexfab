# Clerk Authentication Setup Guide

This project now uses **Clerk** for authentication instead of custom JWT-based auth. This guide will help you set up Clerk for local development and production.

## What Changed

- **Before**: Custom MongoDB authentication with JWT tokens
- **Now**: Clerk handles all authentication (sign up, sign in, OAuth, password reset, etc.)
- **Database**: User model simplified to use Clerk's `clerkId` as the primary identifier

## Setup Steps

### 1. Create a Clerk Account

1. Go to [Clerk.com](https://clerk.com/)
2. Sign up for a free account
3. Create a new application

### 2. Get Your API Keys

After creating an application in Clerk:

1. Go to your **Clerk Dashboard** → **API Keys**
2. Copy your **Publishable Key** (starts with `pk_`)
3. Copy your **Secret Key** (starts with `sk_`)

### 3. Configure Environment Variables

#### Frontend (.env or .env.local)

```dotenv
# Frontend-only configuration
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
VITE_API_URL=http://localhost:5000/api  # Your backend API URL
```

#### Backend (.env)

```dotenv
# Backend configuration
CLERK_SECRET_KEY=sk_test_your_secret_key_here
CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fabric_store
```

### 4. Configure Clerk Dashboard Settings

In your Clerk Dashboard:

1. **Allowed Redirect URLs**:
   - Development: `http://localhost:5173/sign-in/sso-callback`
   - Production: `https://yourdomain.com/sign-in/sso-callback`

2. **Sign-in & Sign-up URLs**:
   - Development: `http://localhost:5173`
   - Production: `https://yourdomain.com`

3. **Allowed Origins**:
   - Development: `http://localhost:5173`
   - Production: `https://yourdomain.com`

### 5. Test Locally

```bash
# Install dependencies (if not already done)
pnpm install

# Run frontend (Terminal 1)
cd frontend
pnpm dev

# Run backend (Terminal 2)
cd backend
pnpm dev
```

Visit `http://localhost:5173` and test the sign-in/sign-up flow.

## Authentication Flow

### Frontend
1. User visits `/sign-in` or `/sign-up`
2. Clerk handles the authentication UI
3. After successful auth, user is redirected to `/` (or specified URL)
4. Access `useUser()` hook from `@clerk/clerk-react` to get user data

### Backend
1. Frontend sends requests with Clerk's JWT token in the `Authorization` header
2. Backend verifies the token using Clerk's SDK
3. Middleware extracts `userId` from the token (this maps to our `clerkId` in MongoDB)

## Available Clerk Hooks (Frontend)

```typescript
import { useUser, useAuth, useClerk, useSignUp } from "@clerk/clerk-react";

// Get current user info
const { user, isLoaded } = useUser();
console.log(user?.firstName, user?.emailAddresses[0]?.emailAddress);

// Get auth state
const { isSignedIn, userId } = useAuth();

// Manual sign out
const { signOut } = useClerk();
await signOut();

// Access sign-up state (for progress tracking)
const { signUp, setActive } = useSignUp();
```

## Database Schema Update

The User model now only stores:
- `clerkId` (required, unique) - Maps to Clerk's user ID
- `name` - User's full name from Clerk
- `email` - User's verified email
- `profileImage` - Optional profile picture
- `role` - User role (user/admin)
- `phone` - Optional phone number
- `address` - Optional address fields
- `isActive` - Account status flag
- `lastLogin` - Last login timestamp

## Fetching User Data from Backend

When making API calls from the frontend, the Clerk JWT is automatically included. Backend example:

```javascript
// Express middleware to verify Clerk token
const { clerkClient } = require("@clerk/backend");

app.use(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    const decoded = await clerkClient.verifyToken(token);
    req.user = decoded;
  }
  next();
});

// In your route:
app.get("/api/profile", async (req, res) => {
  const user = await User.findOne({ clerkId: req.user.sub });
  res.json(user);
});
```

## Removing Custom Auth Completely

The following files have been removed:
- `backend/routes/auth.js` - Custom auth endpoints
- `backend/services/authService.js` - JWT and password logic
- `frontend/src/app/context/AuthContext.tsx` - Custom auth state
- `frontend/src/app/pages/AuthPage.tsx` - Custom auth UI
- `frontend/src/app/components/OAuthButtons.tsx` - OAuth button component

The following have been updated:
- `backend/models/User.js` - Simplified for Clerk
- `frontend/src/app/App.tsx` - Now uses ClerkProvider
- `frontend/src/app/components/Navbar.tsx` - Uses Clerk hooks
- `frontend/src/app/routes.tsx` - Routes updated for Clerk pages

## Troubleshooting

### "Missing Clerk Publishable Key" Error
- Make sure `VITE_CLERK_PUBLISHABLE_KEY` is set in your `.env.local` or `.env`
- The key should start with `pk_`

### Sign-in Not Working
- Verify the Clerk publishable key is correct
- Check that your domain is whitelisted in Clerk Dashboard → Settings → URLs

### Token Verification Failing
- Make sure `CLERK_SECRET_KEY` is set in backend `.env`
- The key should start with `sk_`
- Backend should use `@clerk/backend` SDK for verification

### Redirect Not Working
- Check that your redirect URL is registered in Clerk Dashboard
- Make sure it matches exactly (including protocol and path)

## Production Deployment

1. Create a new Clerk application for production
2. Get new API keys from production app
3. Update environment variables in your hosting service:
   - **Frontend**: Set `VITE_CLERK_PUBLISHABLE_KEY` (production key)
   - **Backend**: Set `CLERK_SECRET_KEY` and `CLERK_PUBLISHABLE_KEY` (production keys)
4. Update the allowed URLs in Clerk Dashboard to your production domain
5. Deploy frontend and backend

## Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk React SDK](https://clerk.com/docs/references/react/overview)
- [Clerk Backend SDK](https://clerk.com/docs/references/backend-sdk/overview)
- [Clerk Dashboard](https://dashboard.clerk.com/)

## Next Steps

After setting up Clerk:

1. ✅ Test sign-in/sign-up locally
2. ✅ Test payment flow (Razorpay integration still active)
3. ✅ Test shipping calculation (Shiprocket integration still active)
4. ✅ Deploy to production with production Clerk keys
5. Monitor user authentication in Clerk Dashboard

---

For more help, visit [Clerk Support](https://support.clerk.dev/)
