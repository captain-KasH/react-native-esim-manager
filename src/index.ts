import { NativeModules, Platform } from 'react-native';
import NativeEsimManager from './NativeEsimManager';

const LINKING_ERROR =
  `The package 'react-native-esim-manager' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({
    ios: "- You have run 'cd ios && pod install'\n",
    default: '',
  }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// Use TurboModule if available, fallback to legacy bridge
const EsimManager =
  NativeEsimManager ||
  NativeModules.EsimManager ||
  NativeModules.ReactNativeEsimManager ||
  new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  );

export interface EsimInfo {
  isEsimSupported: boolean;
  isEsimEnabled: boolean;
  carrierName?: string;
  iccid?: string;
  mobileCountryCode?: string;
  mobileNetworkCode?: string;
}

export interface EsimInstallationData {
  activationCode: string;
  confirmationCode?: string;
}

export interface CellularPlan {
  carrierName: string;
  mobileCountryCode: string;
  mobileNetworkCode: string;
  slotId?: string; // iOS only
  subscriptionId?: number; // Android only
  isEmbedded?: boolean; // Android only (API 28+)
}

export class ReactNativeEsimManager {
  /**
   * Request required permissions (Android only)
   */
  static async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      const { PermissionsAndroid } = require('react-native');
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
          {
            title: 'Phone State Permission',
            message:
              'This app needs access to phone state to detect eSIM information',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS doesn't need runtime permissions
  }

  /**
   * Check if the device supports eSIM
   */
  static async isEsimSupported(): Promise<boolean> {
    return EsimManager.isEsimSupported();
  }

  /**
   * Check if eSIM is currently enabled/active
   */
  static async isEsimEnabled(): Promise<boolean> {
    return EsimManager.isEsimEnabled();
  }

  /**
   * Get detailed eSIM information
   */
  static async getEsimInfo(): Promise<EsimInfo> {
    return EsimManager.getEsimInfo();
  }

  /**
   * Install eSIM profile
   * iOS: Direct installation using activation code
   * Android: Opens system eSIM settings
   * @param data eSIM installation data
   */
  static async installEsimProfile(
    data: EsimInstallationData
  ): Promise<boolean> {
    return EsimManager.installEsimProfile(data);
  }

  /**
   * Get list of available cellular plans
   */
  static async getCellularPlans(): Promise<CellularPlan[]> {
    return EsimManager.getCellularPlans();
  }
}

export default ReactNativeEsimManager;
