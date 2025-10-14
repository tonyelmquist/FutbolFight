import React from 'react';
import { Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

interface BannerAdComponentProps {
  unitId?: string;
  size?: BannerAdSize;
}

const BannerAdComponent: React.FC<BannerAdComponentProps> = ({
  unitId,
  size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER
}) => {
  // Use test ad unit ID in development, replace with real IDs for production
  const adUnitId = unitId || (__DEV__ ? TestIds.ADAPTIVE_BANNER : Platform.select({
    ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY', // Replace with your iOS ad unit ID
    android: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY', // Replace with your Android ad unit ID
  }) || TestIds.ADAPTIVE_BANNER);

  return (
    <BannerAd
      unitId={adUnitId}
      size={size}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
  );
};

export default BannerAdComponent;
