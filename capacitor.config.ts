import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ayoub.zero',
  appName: 'ZERO',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: false,
  },
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#09090b',
      overlaysWebView: false,
    },
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: '#09090b',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
  },
};

export default config;
