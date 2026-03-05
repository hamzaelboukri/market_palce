# Auth0 Setup Guide for ProSets Marketplace

## 1. Create Auth0 Account
1. Go to [https://auth0.com](https://auth0.com) and sign up
2. Create a new tenant (or use existing)

## 2. Create Application
1. Go to Dashboard → Applications → Applications
2. Click "Create Application"
3. Choose "Regular Web Applications"
4. Name: "ProSets Backend"
5. Click "Create"

## 3. Configure Application Settings
### Basic Settings:
- **Application Name**: ProSets Backend
- **Application Type**: Regular Web Applications
- **Application Logo URL**: (optional)

### Application URIs:
- **Allowed Callback URLs**: 
  ```
  http://localhost:3001/auth/callback
  ```
- **Allowed Logout URLs**:
  ```
  http://localhost:3000
  ```
- **Allowed Web Origins**:
  ```
  http://localhost:3001
  http://localhost:3000
  ```

## 4. Enable Social Connections
1. Go to Authentication → Social
2. Enable **Google**:
   - Toggle Google ON
   - Add your Google OAuth credentials (or use Auth0's)
3. Enable **GitHub**:
   - Toggle GitHub ON
   - Add your GitHub OAuth app credentials

## 5. Configure Database
1. Go to Authentication → Database
2. Ensure "Username-Password Authentication" is enabled
3. Configure password policies as needed

## 6. Get Credentials
1. Go to Dashboard → Applications → Applications → ProSets Backend
2. Go to **Settings** tab
3. Copy these values:
   - **Domain**: (e.g., your-tenant.auth0.com)
   - **Client ID**: 
   - **Client Secret**: (click "Reveal" to see)

## 7. Update Environment Variables
1. Copy `packages/backend/.env.auth0-setup` to `packages/backend/.env`
2. Replace the placeholder values with your actual Auth0 credentials:
   ```bash
   AUTH0_DOMAIN=your-actual-domain.auth0.com
   AUTH0_CLIENT_ID=your-actual-client-id
   AUTH0_CLIENT_SECRET=your-actual-client-secret
   AUTH0_CALLBACK_URL=http://localhost:3001/auth/callback
   JWT_SECRET=your-super-secret-jwt-key
   ```

## 8. Frontend Environment
1. Copy `packages/frontend/.env.local.example` to `packages/frontend/.env.local`
2. Update with your Auth0 credentials:
   ```bash
   AUTH0_SECRET=your-auth0-secret-key
   AUTH0_BASE_URL=http://localhost:3000
   AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
   AUTH0_CLIENT_ID=your-frontend-client-id
   ```

## 9. Test the Setup
1. Restart both backend and frontend:
   ```bash
   npm run dev
   ```
2. Navigate to http://localhost:3000/login
3. Try logging in with Google, GitHub, or email

## 10. Production Considerations
- Use HTTPS URLs in production
- Set proper CORS origins
- Configure proper logout URLs
- Use environment variables for secrets
- Enable Auth0 logging and monitoring

## Troubleshooting

### Auth0 login "doesn't work" or shows errors

1. **Auth0 Dashboard** → Applications → Your App → **Settings**
2. Under **Application URIs**, add exactly:
   - **Allowed Callback URLs**: `http://localhost:3001/auth/callback`
   - **Allowed Logout URLs**: `http://localhost:3000`
   - **Allowed Web Origins**: `http://localhost:3000` and `http://localhost:3001`
3. Click **Save Changes** (Auth0 requires explicit save)
4. **Application Type** must be **Regular Web Application** (not Single Page Application)

### "This page isn't working" / "sent an invalid response" from Auth0

This browser error usually means Auth0's response was rejected. Try:

1. **Different browser** – Use Firefox or Edge instead of Chrome
2. **Incognito/Private mode** – Disable extensions that might block or modify requests
3. **Network** – Disable VPN, try mobile hotspot, or another network
4. **Auth0 Dashboard** – Log into [manage.auth0.com](https://manage.auth0.com) and confirm:
   - Tenant is active (free tenants can pause after inactivity)
   - Application is not disabled
   - **Application Type** is **Regular Web Application**
### Other common issues
- **"Callback URL mismatch"**: The URL in Auth0 must match exactly (no trailing slash)
- **"CORS errors"**: Verify Allowed Web Origins in Auth0 settings
- **"Invalid client secret"**: Ensure you're using the correct Client Secret
- **"Database connection failed"**: Check DATABASE_URL and ensure PostgreSQL is running
