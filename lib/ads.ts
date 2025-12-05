// Check if we're in Expo Go (where native modules don't work)
let mobileAds: any = null;
let adsAvailable = false;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  mobileAds = require("react-native-google-mobile-ads").default;
  adsAvailable = true;
} catch (error) {
  console.log("Google Mobile Ads not available (likely running in Expo Go)");
  adsAvailable = false;
}

// Initialize Google Mobile Ads
export async function initializeAds() {
  if (!adsAvailable || !mobileAds) {
    console.log("Skipping Google Mobile Ads initialization (not available)");
    return;
  }

  try {
    await mobileAds().initialize();
    console.log("Google Mobile Ads initialized");
  } catch (error) {
    console.error("Failed to initialize Google Mobile Ads:", error);
  }
}

export function isAdsAvailable() {
  return adsAvailable;
}

// Ad Unit IDs - Replace these with your actual ad unit IDs from AdMob
// For testing, you can use the test IDs provided by Google
export const AD_UNITS = {
  // Test IDs (for development)
  BANNER_TEST: "ca-app-pub-3940256099942544/6300978111",
  INTERSTITIAL_TEST: "ca-app-pub-3940256099942544/1033173712",
  REWARDED_TEST: "ca-app-pub-3940256099942544/5224354917",
  
  // Production IDs (replace with your actual IDs from AdMob)
  BANNER: __DEV__ ? "ca-app-pub-3940256099942544/6300978111" : "YOUR_BANNER_AD_UNIT_ID",
  INTERSTITIAL: __DEV__ ? "ca-app-pub-3940256099942544/1033173712" : "YOUR_INTERSTITIAL_AD_UNIT_ID",
  REWARDED: __DEV__ ? "ca-app-pub-3940256099942544/5224354917" : "YOUR_REWARDED_AD_UNIT_ID",
};

