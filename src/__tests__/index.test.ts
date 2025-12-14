import { NativeModules, Platform, PermissionsAndroid } from 'react-native';
import ReactNativeEsimManager, { EsimInfo, CellularPlan } from '../index';

const mockEsimInfo: EsimInfo = {
  isEsimSupported: true,
  isEsimEnabled: true,
  carrierName: 'Test Carrier',
  iccid: '1234567890123456789',
  mobileCountryCode: '310',
  mobileNetworkCode: '260',
};

const mockCellularPlans: CellularPlan[] = [
  {
    carrierName: 'Test Carrier 1',
    mobileCountryCode: '310',
    mobileNetworkCode: '260',
    slotId: '0001',
    isEmbedded: true,
  },
];

describe('ReactNativeEsimManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('requestPermissions', () => {
    it('should return true on iOS', async () => {
      (Platform as any).OS = 'ios';
      const result = await ReactNativeEsimManager.requestPermissions();
      expect(result).toBe(true);
      expect(PermissionsAndroid.request).not.toHaveBeenCalled();
    });

    it('should request permissions on Android when granted', async () => {
      (Platform as any).OS = 'android';
      (PermissionsAndroid.request as jest.Mock).mockResolvedValue('granted');

      const result = await ReactNativeEsimManager.requestPermissions();
      expect(result).toBe(true);
      expect(PermissionsAndroid.request).toHaveBeenCalledWith(
        'android.permission.READ_PHONE_STATE',
        expect.objectContaining({
          title: 'Phone State Permission',
          message:
            'This app needs access to phone state to detect eSIM information',
        })
      );
    });

    it('should handle Android permission denied', async () => {
      (Platform as any).OS = 'android';
      (PermissionsAndroid.request as jest.Mock).mockResolvedValue('denied');

      const result = await ReactNativeEsimManager.requestPermissions();
      expect(result).toBe(false);
    });

    it('should handle permission request errors', async () => {
      (Platform as any).OS = 'android';
      (PermissionsAndroid.request as jest.Mock).mockRejectedValue(
        new Error('Permission error')
      );
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      const result = await ReactNativeEsimManager.requestPermissions();
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('isEsimSupported', () => {
    it('should call native module', async () => {
      NativeModules.EsimManager.isEsimSupported.mockResolvedValue(true);
      const result = await ReactNativeEsimManager.isEsimSupported();
      expect(result).toBe(true);
    });

    it('should handle native module errors', async () => {
      NativeModules.EsimManager.isEsimSupported.mockRejectedValue(
        new Error('Native error')
      );
      await expect(ReactNativeEsimManager.isEsimSupported()).rejects.toThrow(
        'Native error'
      );
    });
  });

  describe('isEsimEnabled', () => {
    it('should check if eSIM is enabled', async () => {
      NativeModules.EsimManager.isEsimEnabled.mockResolvedValue(false);
      const result = await ReactNativeEsimManager.isEsimEnabled();
      expect(result).toBe(false);
    });
  });

  describe('getEsimInfo', () => {
    it('should return eSIM information', async () => {
      NativeModules.EsimManager.getEsimInfo.mockResolvedValue(mockEsimInfo);
      const result = await ReactNativeEsimManager.getEsimInfo();
      expect(result).toEqual(mockEsimInfo);
    });
  });

  describe('installEsimProfile', () => {
    it('should install eSIM profile', async () => {
      const data = { activationCode: 'LPA:1$test$code' };
      NativeModules.EsimManager.installEsimProfile.mockResolvedValue(true);

      const result = await ReactNativeEsimManager.installEsimProfile(data);
      expect(result).toBe(true);
    });

    it('should install with confirmation code', async () => {
      const data = {
        activationCode: 'LPA:1$test$code',
        confirmationCode: 'confirm',
      };
      NativeModules.EsimManager.installEsimProfile.mockResolvedValue(true);

      const result = await ReactNativeEsimManager.installEsimProfile(data);
      expect(NativeModules.EsimManager.installEsimProfile).toHaveBeenCalledWith(
        data
      );
      expect(result).toBe(true);
    });

    it('should handle installation failure', async () => {
      NativeModules.EsimManager.installEsimProfile.mockResolvedValue(false);
      const result = await ReactNativeEsimManager.installEsimProfile({
        activationCode: 'test',
      });
      expect(result).toBe(false);
    });
  });

  describe('getCellularPlans', () => {
    it('should return cellular plans', async () => {
      NativeModules.EsimManager.getCellularPlans.mockResolvedValue(
        mockCellularPlans
      );
      const result = await ReactNativeEsimManager.getCellularPlans();
      expect(result).toEqual(mockCellularPlans);
    });

    it('should handle empty plans', async () => {
      NativeModules.EsimManager.getCellularPlans.mockResolvedValue([]);
      const result = await ReactNativeEsimManager.getCellularPlans();
      expect(result).toEqual([]);
    });
  });
});
