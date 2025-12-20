// Create shared mock instance
const mockEsimManager = {
  requestPermissions: jest.fn(),
  isEsimSupported: jest.fn(),
  isEsimEnabled: jest.fn(),
  getEsimInfo: jest.fn(),
  installEsimProfile: jest.fn(),
  getCellularPlans: jest.fn(),
};

// Mock TurboModuleRegistry
jest.mock('react-native', () => ({
  TurboModuleRegistry: {
    get: jest.fn(() => mockEsimManager),
  },
  NativeModules: {
    EsimManager: mockEsimManager,
  },
  PermissionsAndroid: {
    request: jest.fn(),
    PERMISSIONS: {
      READ_PHONE_STATE: 'android.permission.READ_PHONE_STATE',
    },
    RESULTS: {
      GRANTED: 'granted',
      DENIED: 'denied',
    },
  },
  Platform: {
    OS: 'ios',
    select: jest.fn(obj => obj.ios || obj.default),
  },
}));

// Ensure global is available
(global as any).jest = jest;
