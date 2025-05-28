# Environment Variables Setup

This document explains how to set up environment variables for this Next.js project.

## Google Analytics Configuration

To enable Google Analytics tracking, you need to set up the `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` environment variable.

### Step 1: Create Environment File

Create a `.env.local` file in the root directory of your project:

```bash
# In the project root directory
touch .env.local
```

### Step 2: Add Google Analytics ID

Add the following line to your `.env.local` file:

```env
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=YOUR_GOOGLE_ANALYTICS_ID
```

Replace `YOUR_GOOGLE_ANALYTICS_ID` with your actual Google Analytics tracking ID:
- For GA4: `G-XXXXXXXXXX`
- For Universal Analytics: `UA-XXXXXXXXX-X`

### Step 3: Example .env.local File

Your `.env.local` file should look like this:

```env
# Google Analytics Configuration
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-1234567890
```

### Important Notes

1. **Security**: The `.env.local` file is already included in `.gitignore` and will not be committed to version control.

2. **Public Variables**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Only use this prefix for non-sensitive data.

3. **Development**: The analytics configuration in `config/analytics.js` is set to disable tracking in development mode by default.

4. **Restart Required**: After adding environment variables, restart your development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Getting Your Google Analytics ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property or select an existing one
3. Go to Admin → Property Settings
4. Copy your Tracking ID or Measurement ID

### Usage in Code

The Google Analytics ID is automatically used in:
- `pages/_document.js` for the Google Analytics script
- `config/analytics.js` for tracking functions

You can also use the helper functions from `config/analytics.js`:

```javascript
import { trackEvent, trackPageView } from '../config/analytics';

// Track custom events
trackEvent('click', 'button', 'header-cta');

// Track page views
trackPageView(window.location.href);
``` 