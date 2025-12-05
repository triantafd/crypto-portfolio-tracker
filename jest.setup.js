require('@testing-library/jest-native/extend-expect');
require('react-native-gesture-handler/jestSetup');



// Mock react-native-svg to just render "fake" views (Safe for Node.js)
jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  
  // Create a fake component that just renders children
  const MockSvg = ({ children, ...props }) => <View {...props}>{children}</View>;
  
  return {
    __esModule: true,
    default: MockSvg,
    Svg: MockSvg,
    Path: (props) => <View {...props} testID="svg-path" />,
    Defs: ({ children }) => <View>{children}</View>,
    LinearGradient: ({ children }) => <View>{children}</View>,
    Stop: () => null,
    Circle: (props) => <View {...props} testID="svg-circle" />,
    Line: (props) => <View {...props} testID="svg-line" />,
    G: ({ children }) => <View>{children}</View>,
    Text: (props) => <View {...props} testID="svg-text" />,
  };
});

// Polyfill structuredClone for Jest
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// Mock Expo winter runtime before anything else
if (typeof global.__ExpoImportMetaRegistry === 'undefined') {
  global.__ExpoImportMetaRegistry = new Map();
}

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock expo-constants
jest.mock('expo-constants', () => ({
  default: {
    expoConfig: {},
  },
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  usePathname: () => '/',
  Stack: {
    Screen: ({ children }) => children,
  },
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock react-native-google-mobile-ads
jest.mock('react-native-google-mobile-ads', () => ({
  BannerAd: () => null,
  BannerAdSize: {
    BANNER: 'BANNER',
  },
  TestIds: {
    BANNER: 'test-banner',
  },
}));

// Mock global.css
jest.mock('../global.css', () => ({}));

