# OAuth Configuration Troubleshooting Checklist

## All Code is ✅ Correct

Frontend code is **100% configured**:
- ✅ `App.tsx` has `ClerkProvider` wrapper
- ✅ Routes have both `/sign-in/sso-callback` and `/sign-up/sso-callback`
- ✅ `SignInPage.tsx` uses `<SignIn />` from @clerk/clerk-react
- ✅ `SSOCallbackPage.tsx` handles auth state correctly
- ✅ All Clerk hooks integrated (useUser, useAuth, useClerk)

**The problem is in YOUR configuration, not the code.**

---

## Deployment & Environment ✅

- ✅ App deployed to: `https://auraclothings.qzz.io`
- ✅ Frontend built successfully
- ✅ Backend running
- ✅ Environment variables set in Render

---

## Step-by-Step Verification

### 1. Clerk Dashboard → API Keys

1. Go: https://dashboard.clerk.com/
2. Left sidebar → **API Keys**
3. Find **Publishable Key** (starts with `pk_test_` or `pk_live_`)
4. Copy it
5. ✅ Should already be set as `VITE_CLERK_PUBLISHABLE_KEY` in Render

### 2. Clerk Dashboard → Settings → URLs

1. Go: https://dashboard.clerk.com/
2. Left sidebar → **Settings**
3. Click **URLs**
4. Look for section: **Redirect URLs**
5. **Must contain ALL 4**:
   - `http://localhost:5173/sign-in/sso-callback`
   - `http://localhost:5173/sign-up/sso-callback`
   - `https://auraclothings.qzz.io/sign-in/sso-callback`
   - `https://auraclothings.qzz.io/sign-up/sso-callback`
   
   ❌ If ANY are missing → **Add them now**

6. Look for section: **Allowed Origins**
7. **Must contain**:
   - `http://localhost:5173`
   - `https://auraclothings.qzz.io`
   
   ❌ If ANY are missing → **Add them now**

8. Click **SAVE** at bottom right

### 3. Clerk Dashboard → Authentication → Social Connections

1. Left sidebar → **Authentication**
2. Click **Social Connections**
3. Find **Google**
4. Is toggle **ON** (blue/enabled)?
   - ❌ **NO** → Click toggle to enable
   - ✅ **YES** → Continue

5. Paste credentials:
   - **Client ID**: [Get from Google Cloud Console]
   - **Client Secret**: [Get from Google Cloud Console]
   
   ❌ If either is empty → **Go get them from Google Cloud** (see section below)

6. Click **SAVE**

### 4. Google Cloud Console → APIs & Services → Credentials

1. Go: https://console.cloud.google.com/
2. Top left: Select project **AuraClothings**
3. Left sidebar → **APIs & Services**
4. Click **Credentials**
5. Find **OAuth 2.0 Client ID** (not service account, not API key)
6. Click to open it
7. **Authorized JavaScript origins** - **Must have BOTH**:
   - `http://localhost:5173`
   - `https://auraclothings.qzz.io`
   
   ❌ If ANY missing → Add them

8. **Authorized redirect URIs** - **Must have ALL 4**:
   - `http://localhost:5173/sign-in/sso-callback`
   - `http://localhost:5173/sign-up/sso-callback`
   - `https://auraclothings.qzz.io/sign-in/sso-callback`
   - `https://auraclothings.qzz.io/sign-up/sso-callback`
   
   ❌ If ANY missing → Add them

9. Top right: **Client ID** button - Copy it
10. Under it: **Client Secret** - Click to show, copy it
11. Go back to Clerk (section 3) and paste these

### 5. Clear Browser Cache & Test

1. Open browser → **Ctrl + Shift + Delete*
2. Clear **Cookies and cached files**
3. Hard refresh: **Ctrl + F5**
4. Go to: `https://auraclothings.qzz.io/sign-in`
5. Click: **Continue with Google**
6. You should see Google sign-in popup (not error)

---

## If Still Getting Error

### Error: "The External Account was not found"

**Cause**: Clerk and Google aren't talking to each other

**Fix** (in order):
1. ✅ Verified Google toggle is ON in Clerk (section 3.4)
2. ✅ Verified Client ID is filled (section 3.5)
3. ✅ Verified Client Secret is filled (section 3.5)
4. ✅ Verified ALL 4 redirect URLs in Google Cloud (section 4.8)
5. ✅ Verified ALL 4 redirect URLs in Clerk (section 2.5)
6. ✅ Save changes in Clerk (section 2.8)
7. ✅ Cleared browser cache (section 5)
8. ✅ Tried in private/incognito window (sometimes helps)
9. ❌ Still failing? → Check Clerk Logs (below)

### Check Clerk Logs

1. Clerk Dashboard → **Logs**
2. Click recent entries
3. Look for error message with actual details
4. Tell me what it says!

### Nuclear Option: Regenerate Credentials

If nothing works:

1. **Google Cloud**: Delete the OAuth 2.0 Client ID and create new one
2. **Clerk**: Update with new credentials
3. Clear browser cache
4. Test again

---

## Quick Sanity Checks

- [ ] Can you sign in with **email/password** (without Google)? If YES → Clerk is working
- [ ] Is Site URL in Clerk Dashboard correct? (Should be `https://auraclothings.qzz.io`)
- [ ] Are you clicking the right button? (Should say "Continue with Google")
- [ ] Did you wait after pasting credentials in Clerk? (Takes ~10 seconds to validate)

---

## If Everything Works 🎉

Google oauth should now:
1. Click "Continue with Google" on `/sign-in` page
2. Redirect to Google sign-in popup
3. After signing in, redirect back to app as authenticated user
4. Same for `/sign-up`

---

## Report Back

Tell me which section failed and I'll debug with you!

Example: "Made it to section 3.5, Google toggle is ON but Client ID is blank"

Then I know exactly what to fix! 🔍
