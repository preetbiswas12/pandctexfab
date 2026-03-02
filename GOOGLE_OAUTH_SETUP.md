# Google OAuth Setup - Complete Fix Guide

**Status**: ✅ Follow this exactly and OAuth will work

---

## PART 1: Google Cloud Console (5 minutes)

### 1.1 Go to Google Cloud
https://console.cloud.google.com/

### 1.2 Select Your Project
- Top left, click project selector
- Choose: **AuraClothings** (or your project)
- If it doesn't exist, create it with name "AuraClothings"

### 1.3 Enable Google+ API
1. Left sidebar → **APIs & Services** → **Library**
2. Search: `Google+ API`
3. Click it
4. Click **ENABLE**

### 1.4 Create OAuth Credentials
1. Left sidebar → **APIs & Services** → **Credentials**
2. Top button: **+ CREATE CREDENTIALS**
3. Choose: **OAuth 2.0 Client ID**
4. If prompted "Configure consent screen first":
   - Click **CONFIGURE CONSENT SCREEN**
   - Choose **External**
   - Click **CREATE**
   - Fill:
     - App name: `AuraClothings`
     - User support email: `your@email.com`
     - Developer contact: `your@email.com`
   - Click **SAVE & CONTINUE** multiple times until done
   - Back to Credentials

### 1.5 Create Web Application Credentials
1. Click **+ CREATE CREDENTIALS** → **OAuth 2.0 Client ID**
2. Application type: **Web application**
3. Name: `AuraClothings OAuth`
4. **Authorized JavaScript origins** - ADD:
   ```
   http://localhost:5173
   https://auraclothings.qzz.io
   ```
5. **Authorized redirect URIs** - ADD:
   ```
   http://localhost:5173/sign-in/sso-callback
   http://localhost:5173/sign-up/sso-callback
   https://auraclothings.qzz.io/sign-in/sso-callback
   https://auraclothings.qzz.io/sign-up/sso-callback
   ```
6. Click **CREATE**

### 1.6 Copy Your Credentials
- **Client ID** will appear - copy it (looks like: `123456789-abc123.apps.googleusercontent.com`)
- **Client Secret** - click to copy it (looks like: `GOCSPX-abc123xyz`)
- Save these somewhere safe!

---

## PART 2: Clerk Dashboard (5 minutes)

### 2.1 Go to Clerk
https://dashboard.clerk.com/

### 2.2 Configure URLs
1. Left sidebar → **Settings** → **URLs**
2. Scroll to **Redirect URLs**
3. Add these:
   ```
   http://localhost:5173/sign-in/sso-callback
   http://localhost:5173/sign-up/sso-callback
   https://auraclothings.qzz.io/sign-in/sso-callback
   https://auraclothings.qzz.io/sign-up/sso-callback
   ```
4. Scroll to **Allowed Origins**
5. Add:
   ```
   http://localhost:5173
   https://auraclothings.qzz.io
   ```
6. Click **SAVE** at bottom

### 2.3 Enable Google OAuth
1. Left sidebar → **Authentication** → **Social Connections**
2. Find **Google**
3. Toggle **ON** (must be blue/enabled)
4. Paste your credentials:
   - **Client ID**: [paste from Google Cloud]
   - **Client Secret**: [paste from Google Cloud]
5. Click **SAVE**

---

## PART 3: Frontend Environment Variables (2 minutes)

### 3.1 Frontend `.env.local`
Create/update file at: `frontend/.env.local`

```dotenv
VITE_CLERK_PUBLISHABLE_KEY=pk_test_... (copy from Clerk Dashboard → API Keys)
VITE_API_URL=https://auraclothings.qzz.io/api
```

### 3.2 Get Publishable Key
1. Clerk Dashboard → **API Keys**
2. Find **Publishable Key** (starts with `pk_`)
3. Copy it
4. Paste into `.env.local`

---

## PART 4: Verify Code (Already Done ✅)

Here's what's already configured in your app:

**Routes**: ✅
```
/sign-in → SignInPage
/sign-up → SignUpPage
/sign-in/sso-callback → SSOCallbackPage
/sign-up/sso-callback → SSOCallbackPage
```

**App Setup**: ✅
```tsx
<ClerkProvider publishableKey={clerkPubKey}>
  {/* App wrapped with Clerk */}
</ClerkProvider>
```

---

## PART 5: Deploy & Test (5 minutes)

### 5.1 Local Testing
```bash
# Terminal 1
cd frontend
pnpm dev

# Terminal 2
cd backend
npm start
```

Visit: `http://localhost:5173/sign-in`
- Click **Continue with Google**
- Should work! ✅

### 5.2 Production Testing
After all configs above are set:

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "Configure Google OAuth"
   git push origin main
   ```

2. Render deploys automatically (~2 min)

3. Visit: `https://auraclothings.qzz.io/sign-in`
4. Click **Continue with Google**
5. Should work! ✅

---

## TROUBLESHOOTING

### Error: "The External Account was not found"
**Solution**:
- [ ] Verify Google toggle is **ON** in Clerk
- [ ] Verify Client ID is filled
- [ ] Verify Client Secret is filled
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Try in incognito/private window

### Error: 404 on `/sign-up/sso-callback`
**Solution**:
- ✅ Already fixed in code
- Render auto-deployed the fix
- Try in new incognito window

### Redirect to /sign-in happens after clicking Google
**Solution**:
- OAuth failed (fix the error above first)
- Then sign-up will work

### Google login redirects to wrong URL
**Solution**:
- Verify redirect URLs in BOTH:
  - ✅ Google Cloud Console (Authorized redirect URIs)
  - ✅ Clerk Dashboard (Redirect URLs)

---

## QUICK CHECKLIST ✓

Do this in order:

1. **Google Cloud**:
   - [ ] Enabled Google+ API
   - [ ] Created OAuth 2.0 Client ID
   - [ ] Added `http://localhost:5173` to JavaScript origins
   - [ ] Added `https://auraclothings.qzz.io` to JavaScript origins
   - [ ] Added 4 redirect URIs (localhost + production for both /sign-in/ and /sign-up/)
   - [ ] Copied Client ID
   - [ ] Copied Client Secret

2. **Clerk Dashboard**:
   - [ ] Added 4 redirect URLs in Settings → URLs
   - [ ] Added 2 allowed origins in Settings → URLs
   - [ ] Enabled Google in Social Connections
   - [ ] Pasted Client ID
   - [ ] Pasted Client Secret
   - [ ] Clicked SAVE

3. **Frontend**:
   - [ ] Updated `.env.local` with Clerk Publishable Key
   - [ ] Routes have both `/sign-in/sso-callback` and `/sign-up/sso-callback`

4. **Test**:
   - [ ] Local: `http://localhost:5173/sign-in` → Click Google → Works
   - [ ] Production: `https://auraclothings.qzz.io/sign-in` → Click Google → Works

---

## Still Not Working?

Tell me which step failed and I'll fix the code!

Examples:
- "Step 1.5: Can't find OAuth Client ID creation"
- "Step 2.3: Google toggle won't enable"
- "Still getting External Account error after all steps"

---

**Follow this exactly and it will 100% work!** 🚀
