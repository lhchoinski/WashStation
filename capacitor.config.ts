import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'washstation-mob-app',
  webDir: 'www',
  bundledWebRuntime: false, // Altere para true se estiver usando uma web runtime embutida
  cordova: {
    preferences: {
      ScrollEnabled: 'false',
      'android-minSdkVersion': '19',
      BackupWebStorage: 'none',
      SplashMaintainAspectRatio: 'true',
      FadeSplashScreenDuration: '300',
      SplashShowOnlyFirstTime: 'false',
      SplashScreen: 'screen',
      SplashScreenDelay: '3000',
      orientation: 'portrait',
      ShowSplashScreenSpinner: 'false'
    }
  }
};

export default config;
