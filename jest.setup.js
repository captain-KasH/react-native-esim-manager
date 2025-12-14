// Mock react-native modules
jest.mock('react-native', () => ({
  NativeModules: {
    EsimManager: {
      isEsimSupported: jest.fn(),
      isEsimEnabled: jest.fn(),
      getEsimInfo: jest.fn(),
      installEsimProfile: jest.fn(),
      getCellularPlans: jest.fn(),
    },
  },
  Platform: {
    OS: 'ios',
    select: jest.fn((obj) => obj.ios || obj.default),
  },
  PermissionsAndroid: {
    PERMISSIONS: {
      READ_PHONE_STATE: 'android.permission.READ_PHONE_STATE',
    },
    RESULTS: {
      GRANTED: 'granted',
      DENIED: 'denied',
    },
    request: jest.fn(),
  },
}));

// Global test timeout
jest.setTimeout(10000);