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
    });

    it('should request permissions on Android', async () => {
      (Platform as any).OS = 'android';
      (PermissionsAndroid.request as jest.Mock).mockResolvedValue('granted');
      
      const result = await ReactNativeEsimManager.requestPermissions();
      expect(result).toBe(true);
    });
  });

  describe('isEsimSupported', () => {
    it('should call native module', async () => {
      NativeModules.EsimManager.isEsimSupported.mockResolvedValue(true);
      const result = await ReactNativeEsimManager.isEsimSupported();
      expect(result).toBe(true);
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
  });

  describe('getCellularPlans', () => {
    it('should return cellular plans', async () => {
      NativeModules.EsimManager.getCellularPlans.mockResolvedValue(mockCellularPlans);
      const result = await ReactNativeEsimManager.getCellularPlans();
      expect(result).toEqual(mockCellularPlans);
    });
  });
});