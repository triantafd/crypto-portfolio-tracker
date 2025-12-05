import { View, StyleSheet } from "react-native";
import { useState } from "react";
import { isAdsAvailable } from "../../lib/ads";

interface BannerAdComponentProps {
  adUnitId?: string;
  size?: any;
  className?: string;
}

// Try to import Google Mobile Ads components
let BannerAd: any = null;
let BannerAdSize: any = null;
let TestIds: any = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const adsModule = require("react-native-google-mobile-ads");
  BannerAd = adsModule.BannerAd;
  BannerAdSize = adsModule.BannerAdSize;
  TestIds = adsModule.TestIds;
} catch (error) {
  // Ads not available (likely Expo Go)
  console.log("Google Mobile Ads components not available");
}

export default function BannerAdComponent({
  adUnitId,
  size,
  className,
}: BannerAdComponentProps) {
  const [adError, setAdError] = useState(false);

  // Don't render if ads aren't available or if there's an error
  if (!isAdsAvailable() || !BannerAd || adError) {
    return null;
  }

  const TEST_BANNER_ID = TestIds?.BANNER || "ca-app-pub-3940256099942544/6300978111";
  const adSize = size || BannerAdSize?.BANNER;

  return (
    <View className={className} style={styles.container}>
      <BannerAd
        unitId={adUnitId || TEST_BANNER_ID}
        size={adSize}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => {
          setAdError(false);
        }}
        onAdFailedToLoad={(error: any) => {
          console.log("Banner ad failed to load:", error);
          setAdError(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});

