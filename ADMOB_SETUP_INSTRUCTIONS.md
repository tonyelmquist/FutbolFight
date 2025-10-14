# AdMob Setup - Development Build Required

## Issue: "RNGoogleMobileAdsModule could not be found"

This error occurs because **AdMob requires native code** and cannot run in Expo Go. You need to create a **development build**.

## Solution: Create a Development Build

### Option 1: Local Development Build (Fastest for testing)

For iOS:
```bash
npx expo run:ios
```

For Android:
```bash
npx expo run:android
```

This will:
- Build the app with native modules included
- Install it on your simulator/device
- Start the development server

### Option 2: EAS Development Build (For physical devices)

If you want to test on a physical device without cables:

1. **Install EAS CLI:**
```bash
npm install -g eas-cli
```

2. **Login to Expo:**
```bash
eas login
```

3. **Configure the project:**
```bash
eas build:configure
```

4. **Create a development build:**

For iOS (requires Apple Developer account):
```bash
eas build --profile development --platform ios
```

For Android:
```bash
eas build --profile development --platform android
```

5. **Install the build on your device** and open it
6. **Start the dev server:** `npx expo start --dev-client`

## Current Status

The app has been configured to gracefully handle the missing AdMob module:
- ✅ AdMob is properly configured in app.json
- ✅ Code uses try/catch to avoid crashes
- ✅ App will run WITHOUT ads in Expo Go
- ✅ App will show ads once you build with native modules

## What Happens Now

**In Expo Go:** App runs normally but without ads (AdMob components are conditionally rendered)

**In Development Build:** App runs with full AdMob functionality and test ads will display

## Quick Start

The fastest way to see ads working:

```bash
# Make sure you're in the project directory
cd /Users/mistertony/Development/cv-misc

# For iOS (if you have Xcode installed)
npx expo run:ios

# For Android (if you have Android Studio installed)
npx expo run:android
```

## Next Steps After Building

1. The app will open automatically in the simulator
2. You should see a test banner ad at the bottom of the home screen
3. Check the console for "AdMob initialized" message
4. To show interstitial or rewarded ads, import and call:
   ```javascript
   import { InterstitialAdManager, RewardedAdManager } from '@/components/ads';

   // Show interstitial
   InterstitialAdManager.show();

   // Show rewarded ad
   RewardedAdManager.show();
   ```

## Production Setup

When ready for production, update the ad unit IDs in:
- `app.json` - Replace app IDs (lines 46-47)
- `components/ads/BannerAd.tsx` - Replace ad unit IDs (lines 18-19)
- `components/ads/InterstitialAdManager.ts` - Replace ad unit IDs (lines 17-18)
- `components/ads/RewardedAdManager.ts` - Replace ad unit IDs (lines 17-18)

Then build for production:
```bash
eas build --platform ios
eas build --platform android
```
