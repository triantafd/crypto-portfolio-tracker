# Google Ads Setup Guide

This app is configured with Google Mobile Ads. Currently, it's using **test ad unit IDs** for development.

## Current Setup

- ✅ Google Mobile Ads SDK installed
- ✅ Ads initialized on app startup
- ✅ Banner ads added to:
  - Home screen (Market tab)
  - Portfolio Overview tab
  - Portfolio Transactions tab

## Getting Your Real Ad Unit IDs

1. **Create an AdMob Account**
   - Go to [Google AdMob](https://admob.google.com/)
   - Sign in with your Google account
   - Create a new app or select your existing app

2. **Create Ad Units**
   - In AdMob dashboard, go to "Apps" → Select your app
   - Click "Ad units" → "Add ad unit"
   - Choose "Banner" ad type
   - Copy the Ad Unit ID (format: `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX`)

3. **Update Ad Unit IDs**
   - Open `lib/ads.ts`
   - Replace the production IDs:
     ```typescript
     BANNER: "YOUR_BANNER_AD_UNIT_ID",
     INTERSTITIAL: "YOUR_INTERSTITIAL_AD_UNIT_ID",
     REWARDED: "YOUR_REWARDED_AD_UNIT_ID",
     ```

4. **Update App IDs in app.json**
   - Get your App ID from AdMob (format: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`)
   - Update `app.json`:
     ```json
     "androidAppId": "YOUR_ANDROID_APP_ID",
     "iosAppId": "YOUR_IOS_APP_ID"
     ```

## Test Ad Unit IDs

The app currently uses Google's test ad unit IDs:
- **Banner**: `ca-app-pub-3940256099942544/6300978111`
- **Interstitial**: `ca-app-pub-3940256099942544/1033173712`
- **Rewarded**: `ca-app-pub-3940256099942544/5224354917`

These will show test ads in development. **Never use test IDs in production!**

## Building for Production

After setting up your real ad unit IDs:

1. **For Android:**
   ```bash
   eas build --platform android
   ```

2. **For iOS:**
   ```bash
   eas build --platform ios
   ```

## Important Notes

- ⚠️ **Test ads are only for development** - Replace with real IDs before production
- ⚠️ **AdMob requires app review** - Your app needs to be published or in review
- ⚠️ **Follow AdMob policies** - Ensure your app complies with Google's ad policies
- ✅ **Test IDs work in development** - You can test ad integration without real IDs

## Ad Placement

Banner ads are currently placed at:
- Bottom of Market screen (home tab)
- Bottom of Portfolio Overview tab
- Bottom of Portfolio Transactions tab

You can add more ads or change placement by modifying the components.

