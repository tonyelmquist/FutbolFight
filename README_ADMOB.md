# AdMob Integration Guide

This app has been integrated with Google AdMob for mobile advertising. Below is a guide on how to use and configure ads.

## Setup Complete

The following has been set up:
- ✅ Installed `react-native-google-mobile-ads` package
- ✅ Configured AdMob plugin in `app.json`
- ✅ Initialized AdMob in the app layout
- ✅ Created reusable ad components

## Test Mode

Currently, the app is configured to use **test ad units** during development. You'll see test ads when running the app.

## Production Setup

To use real ads in production:

1. **Get your AdMob App IDs:**
   - Sign up for [Google AdMob](https://admob.google.com/)
   - Create an app for iOS and Android
   - Get your app IDs

2. **Update app.json:**
   Replace the test IDs in `app.json` with your real app IDs:
   ```json
   {
     "androidAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX",
     "iosAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"
   }
   ```

3. **Create Ad Units:**
   - In AdMob dashboard, create ad units for:
     - Banner ads
     - Interstitial ads
     - Rewarded ads

4. **Update Ad Unit IDs:**
   Replace the placeholder IDs in these files:
   - `components/ads/BannerAd.tsx` (lines 15-16)
   - `components/ads/InterstitialAdManager.ts` (lines 17-18)
   - `components/ads/RewardedAdManager.ts` (lines 17-18)

## Available Ad Components

### 1. Banner Ads
Shows at the bottom of the screen. Already implemented on the home screen.

```jsx
import { BannerAd } from '@/components/ads';

<BannerAd />
```

### 2. Interstitial Ads
Full-screen ads shown at natural transition points (e.g., between screens).

```jsx
import { InterstitialAdManager } from '@/components/ads';

// Show an interstitial ad
InterstitialAdManager.show();
```

**Example usage:** Show after user completes a game round:
```jsx
const handleGameComplete = () => {
  // Game logic here
  InterstitialAdManager.show();
  navigation.navigate('results');
};
```

### 3. Rewarded Ads
Ads that reward users for watching (e.g., extra lives, coins).

```jsx
import { RewardedAdManager } from '@/components/ads';

// Show a rewarded ad
RewardedAdManager.show();
```

**Example usage:** Reward user with bonus points:
```jsx
const handleWatchAd = () => {
  RewardedAdManager.show();
  // Reward is handled in RewardedAdManager.ts
  // Customize the reward logic in the EARNED_REWARD event listener
};
```

## Ad Best Practices

1. **Don't overwhelm users:** Show interstitial ads at natural breaks, not too frequently
2. **Banner placement:** Bottom of screen is least intrusive
3. **Rewarded ads:** Make sure users know what they'll get for watching
4. **Test thoroughly:** Always test with test IDs before going live

## Rebuild Required

After making changes to `app.json`, you need to rebuild the app:

```bash
# For development build
npx expo prebuild
npx expo run:ios
npx expo run:android

# For production builds through EAS
eas build --platform ios
eas build --platform android
```

## Troubleshooting

- **Ads not showing:** Make sure you've rebuilt the app after adding the plugin
- **"Invalid Ad Unit ID":** Double-check your ad unit IDs in AdMob dashboard
- **iOS issues:** Ensure you've updated your App Store listing with AdMob integration details

## Resources

- [AdMob Documentation](https://developers.google.com/admob)
- [react-native-google-mobile-ads](https://docs.page/invertase/react-native-google-mobile-ads)
- [Expo Config Plugins](https://docs.expo.dev/guides/config-plugins/)
