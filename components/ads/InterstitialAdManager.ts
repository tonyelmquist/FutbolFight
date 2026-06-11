import { Platform } from 'react-native';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

class InterstitialAdManager {
  private interstitial: InterstitialAd | null = null;
  private isLoaded: boolean = false;
  private isLoading: boolean = false;
  private isInitialized: boolean = false;

  private init() {
    if (this.isInitialized) {
      return;
    }

    // Use test ad unit ID in development
    const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : Platform.select({
      ios: 'ca-app-pub-5795876019651532/4768280946', // ff_interstitial
      android: TestIds.INTERSTITIAL, // No Android AdMob app yet — create one before shipping Android
    }) || TestIds.INTERSTITIAL;

    this.interstitial = InterstitialAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    this.interstitial.addAdEventListener(AdEventType.LOADED, () => {
      this.isLoaded = true;
      this.isLoading = false;
      console.log('Interstitial ad loaded');
    });

    this.interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
      this.isLoaded = false;
      this.isLoading = false;
      console.error('Interstitial ad error:', error);
    });

    this.interstitial.addAdEventListener(AdEventType.CLOSED, () => {
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
    this.interstitial?.load();
  }

  public async show() {
    if (!this.isInitialized) {
      this.init();
    }

    if (this.isLoaded && this.interstitial) {
      try {
        await this.interstitial.show();
      } catch (error) {
        console.error('Error showing interstitial ad:', error);
      }
    } else {
      console.log('Interstitial ad not ready yet, loading now...');
      this.load();
    }
  }

  public getIsLoaded(): boolean {
    return this.isLoaded;
  }
}

// Export singleton instance
export default new InterstitialAdManager();
