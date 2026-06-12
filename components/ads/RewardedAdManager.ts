import { Platform } from 'react-native';
import { AdEventType, RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';

class RewardedAdManager {
  private rewarded: RewardedAd | null = null;
  private isLoaded: boolean = false;
  private isLoading: boolean = false;
  private isInitialized: boolean = false;

  private init() {
    if (this.isInitialized) {
      return;
    }

    // Use test ad unit ID in development
    const adUnitId = __DEV__ ? TestIds.REWARDED : Platform.select({
      ios: 'ca-app-pub-5795876019651532/7991500224', // ff_rewarded
      android: TestIds.REWARDED, // No Android AdMob app yet — create one before shipping Android
    }) || TestIds.REWARDED;

    this.rewarded = RewardedAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    this.rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      this.isLoaded = true;
      this.isLoading = false;
      console.log('Rewarded ad loaded');
    });

    this.rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
      console.log('User earned reward:', reward);
      // TODO: Handle reward logic here (e.g., give user coins, extra lives, etc.)
    });

    // ERROR and CLOSED are generic AdEventType events — RewardedAdEventType
    // only defines LOADED and EARNED_REWARD.
    this.rewarded.addAdEventListener(AdEventType.ERROR, (error) => {
      this.isLoaded = false;
      this.isLoading = false;
      console.error('Rewarded ad error:', error);
    });

    this.rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      this.isLoaded = false;
      this.load(); // Preload the next ad
    });

    this.isInitialized = true;
  }

  public load() {
    if (!this.isInitialized) {
      this.init();
    }

    if (this.isLoading || this.isLoaded) {
      return;
    }

    this.isLoading = true;
    this.rewarded?.load();
  }

  public async show() {
    if (!this.isInitialized) {
      this.init();
    }

    if (this.isLoaded && this.rewarded) {
      try {
        await this.rewarded.show();
      } catch (error) {
        console.error('Error showing rewarded ad:', error);
      }
    } else {
      console.log('Rewarded ad not ready yet, loading now...');
      this.load();
    }
  }

  public getIsLoaded(): boolean {
    return this.isLoaded;
  }
}

// Export singleton instance
export default new RewardedAdManager();
