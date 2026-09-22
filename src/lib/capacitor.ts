import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

export interface BackButtonHandlers {
  hasOpenModal: () => boolean;
  closeTopModal: () => void;
  canNavigateBack: () => boolean;
  navigateBack: () => void;
}

export async function initCapacitorPlugins(handlers: BackButtonHandlers): Promise<() => void> {
  if (!Capacitor.isNativePlatform()) {
    return () => {};
  }

  try {
    // Status Bar styling
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#09090b' });
  } catch (err) {
    console.warn('StatusBar initialization notice:', err);
  }

  try {
    // Hide splash screen smoothly
    await SplashScreen.hide();
  } catch (err) {
    console.warn('SplashScreen notice:', err);
  }

  // Hardware Back Button listener for Android
  let backListener: { remove: () => Promise<void> } | null = null;
  try {
    backListener = await CapApp.addListener('backButton', ({ canGoBack }) => {
      if (handlers.hasOpenModal()) {
        handlers.closeTopModal();
      } else if (handlers.canNavigateBack()) {
        handlers.navigateBack();
      } else if (canGoBack) {
        window.history.back();
      } else {
        CapApp.exitApp();
      }
    });
  } catch (err) {
    console.warn('Capacitor backButton listener notice:', err);
  }

  return () => {
    if (backListener) {
      backListener.remove().catch(() => {});
    }
  };
}
