# react-native-esim-manager

React Native package for eSIM detection and management on iOS and Android devices.

## Installation

```sh
npm install react-native-esim-manager
```

### iOS Setup

Run `cd ios && pod install` after installation.

### Android Setup

Add the following permission to your `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
```

## Platform Support

- **iOS**: 12.0+ (eSIM installation supported)
- **Android**: API 28+ (Android 9.0+, opens system settings for eSIM management)

## API Reference

### Methods

#### `requestPermissions(): Promise<boolean>`

Request required permissions (Android only). Returns `true` if granted.

```js
const granted = await ReactNativeEsimManager.requestPermissions();
```

#### `isEsimSupported(): Promise<boolean>`

Check if the device supports eSIM functionality.

```js
const isSupported = await ReactNativeEsimManager.isEsimSupported();
```

#### `isEsimEnabled(): Promise<boolean>`

Check if eSIM is currently enabled/active on the device.

```js
const isEnabled = await ReactNativeEsimManager.isEsimEnabled();
```

#### `getEsimInfo(): Promise<EsimInfo>`

Get detailed eSIM information including carrier details.

```js
const esimInfo = await ReactNativeEsimManager.getEsimInfo();
```

**EsimInfo Interface:**
```typescript
interface EsimInfo {
  isEsimSupported: boolean;        // Device hardware supports eSIM technology
  isEsimEnabled: boolean;          // At least one eSIM profile is active/enabled
  carrierName?: string;            // Name of the mobile carrier/operator (e.g., "Verizon", "AT&T")
  iccid?: string;                  // Integrated Circuit Card ID - unique eSIM identifier (iOS only, not implemented)
  mobileCountryCode?: string;      // 3-digit country code (e.g., "310" for USA, "234" for UK)
  mobileNetworkCode?: string;      // 2-3 digit network code identifying the carrier within country
}
```

#### `installEsimProfile(data: EsimInstallationData): Promise<boolean>`

Install an eSIM profile using activation code.

- **iOS**: Direct installation via system dialog
- **Android**: Opens system eSIM settings (activation code copied to clipboard)

```js
const success = await ReactNativeEsimManager.installEsimProfile({
  activationCode: 'LPA:1$prod.smdp-plus.rsp.goog$ACTIVATION-CODE',
  confirmationCode: 'OPTIONAL-CONFIRMATION-CODE' // iOS only
});
```

**EsimInstallationData Interface:**
```typescript
interface EsimInstallationData {
  activationCode: string;          // LPA URL format: "LPA:1$server$activation-code" (required)
  confirmationCode?: string;       // Additional verification code provided by carrier (iOS only, optional)
}
```

#### `getCellularPlans(): Promise<CellularPlan[]>`

Get list of available cellular plans on the device.

```js
const plans = await ReactNativeEsimManager.getCellularPlans();
```

**CellularPlan Interface:**
```typescript
interface CellularPlan {
  carrierName: string;             // Display name of mobile carrier (e.g., "T-Mobile", "Orange")
  mobileCountryCode: string;       // 3-digit ISO country code for the network
  mobileNetworkCode: string;       // 2-3 digit code identifying specific carrier network
  slotId?: string;                 // iOS: Unique identifier for SIM slot ("0001", "0002", etc.)
  subscriptionId?: number;         // Android: System-assigned subscription identifier (integer)
  isEmbedded?: boolean;            // Android: true if this is an eSIM, false for physical SIM
}
```

## Usage Example

```js
import ReactNativeEsimManager from 'react-native-esim-manager';

// Request permissions (Android)
const granted = await ReactNativeEsimManager.requestPermissions();

// Check eSIM support
const isSupported = await ReactNativeEsimManager.isEsimSupported();

// Check eSIM status
const isEnabled = await ReactNativeEsimManager.isEsimEnabled();

// Get detailed eSIM information
const esimInfo = await ReactNativeEsimManager.getEsimInfo();
console.log('Carrier:', esimInfo.carrierName);
console.log('MCC:', esimInfo.mobileCountryCode);
console.log('MNC:', esimInfo.mobileNetworkCode);

// Install eSIM profile
try {
  const success = await ReactNativeEsimManager.installEsimProfile({
    activationCode: 'LPA:1$prod.smdp-plus.rsp.goog$YOUR-ACTIVATION-CODE',
    confirmationCode: 'OPTIONAL-CODE' // iOS only
  });
  
  if (success) {
    console.log('eSIM installation initiated');
  }
} catch (error) {
  console.error('Installation failed:', error.message);
}

// Get cellular plans
const plans = await ReactNativeEsimManager.getCellularPlans();
plans.forEach((plan, index) => {
  console.log(`Plan ${index + 1}:`, {
    carrier: plan.carrierName,
    mcc: plan.mobileCountryCode,
    mnc: plan.mobileNetworkCode,
    isEsim: plan.isEmbedded // Android only
  });
});
```

## Error Handling

All methods return promises and may throw errors. Common error codes:

- `PERMISSION_DENIED` - Required permissions not granted (Android)
- `ESIM_NOT_SUPPORTED` - Device doesn't support eSIM
- `INVALID_ACTIVATION_CODE` - Invalid or missing activation code
- `INSTALLATION_FAILED` - eSIM installation failed
- `INSTALLATION_CANCELLED` - User cancelled installation (iOS)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)