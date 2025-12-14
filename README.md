# react-native-esim-manager

[![npm version](https://badge.fury.io/js/react-native-esim-manager.svg)](https://badge.fury.io/js/react-native-esim-manager)
[![CI](https://github.com/captain-KasH/react-native-esim-manager/actions/workflows/ci.yml/badge.svg)](https://github.com/captain-KasH/react-native-esim-manager/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/captain-KasH/react-native-esim-manager/branch/main/graph/badge.svg)](https://codecov.io/gh/captain-KasH/react-native-esim-manager)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

React Native package for eSIM detection and management on iOS and Android devices.

## 📚 Documentation

- **[API Reference](#api-reference)** - Complete method documentation
- **[Contributing Guide](CONTRIBUTING.md)** - Development workflow and guidelines
- **[Security Policy](SECURITY.md)** - Vulnerability reporting and security practices
- **[Code of Conduct](CODE_OF_CONDUCT.md)** - Community standards and behavior
- **[Changelog](CHANGELOG.md)** - Version history and changes
- **[Branch Strategy](.github/branch-strategy.md)** - Git workflow and branching model

## 🚀 Installation

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

## 🔧 Platform Support

- **iOS**: 12.0+ (eSIM installation supported)
- **Android**: API 28+ (Android 9.0+, opens system settings for eSIM management)

## 📖 API Reference

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
  isEsimSupported: boolean; // Device hardware supports eSIM technology
  isEsimEnabled: boolean; // At least one eSIM profile is active/enabled
  carrierName?: string; // Name of the mobile carrier/operator (e.g., "Verizon", "AT&T")
  iccid?: string; // Integrated Circuit Card ID - unique eSIM identifier (iOS only, not implemented)
  mobileCountryCode?: string; // 3-digit country code (e.g., "310" for USA, "234" for UK)
  mobileNetworkCode?: string; // 2-3 digit network code identifying the carrier within country
}
```

#### `installEsimProfile(data: EsimInstallationData): Promise<boolean>`

Install an eSIM profile using activation code.

- **iOS**: Direct installation via system dialog
- **Android**: Opens system eSIM settings (activation code copied to clipboard)

```js
const success = await ReactNativeEsimManager.installEsimProfile({
  activationCode: 'LPA:1$prod.smdp-plus.rsp.goog$ACTIVATION-CODE',
  confirmationCode: 'OPTIONAL-CONFIRMATION-CODE', // iOS only
});
```

**EsimInstallationData Interface:**

```typescript
interface EsimInstallationData {
  activationCode: string; // LPA URL format: "LPA:1$server$activation-code" (required)
  confirmationCode?: string; // Additional verification code provided by carrier (iOS only, optional)
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
  carrierName: string; // Display name of mobile carrier (e.g., "T-Mobile", "Orange")
  mobileCountryCode: string; // 3-digit ISO country code for the network
  mobileNetworkCode: string; // 2-3 digit code identifying specific carrier network
  slotId?: string; // iOS: Unique identifier for SIM slot ("0001", "0002", etc.)
  subscriptionId?: number; // Android: System-assigned subscription identifier (integer)
  isEmbedded?: boolean; // Android: true if this is an eSIM, false for physical SIM
}
```

## 💡 Usage Example

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
    confirmationCode: 'OPTIONAL-CODE', // iOS only
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
    isEsim: plan.isEmbedded, // Android only
  });
});
```

## ⚠️ Error Handling

All methods return promises and may throw errors. Common error codes:

- `PERMISSION_DENIED` - Required permissions not granted (Android)
- `ESIM_NOT_SUPPORTED` - Device doesn't support eSIM
- `INVALID_ACTIVATION_CODE` - Invalid or missing activation code
- `INSTALLATION_FAILED` - eSIM installation failed
- `INSTALLATION_CANCELLED` - User cancelled installation (iOS)

## 🛠️ Development

### Prerequisites

- Node.js >= 16.0.0
- React Native >= 0.70.0
- iOS 12.0+ / Android API 28+

### Setup

```bash
# Clone the repository
git clone https://github.com/captain-KasH/react-native-esim-manager.git
cd react-native-esim-manager

# Install dependencies
npm install

# Setup git hooks
npx husky install
```

### Development Scripts

```bash
# Run tests
npm test
npm run test:coverage

# Type checking
npm run typecheck

# Linting
npm run lint
npm run lint:fix

# Code formatting
npm run format
npm run format:check

# Full validation (runs before commit)
npm run validate

# Pre-push validation
npm run pre-push

# Build package
npm run prepack

# Local CI simulation
npm run ci:local
```

### Testing

The project includes comprehensive unit tests with 94%+ coverage:

```bash
# Run tests with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

### Quality Assurance

- **TypeScript**: Strict mode enabled for type safety
- **ESLint**: Code quality and consistency
- **Prettier**: Automatic code formatting
- **Husky**: Pre-commit hooks for quality gates
- **Jest**: Unit testing with coverage reporting
- **GitHub Actions**: Automated CI/CD pipeline

## 🚀 CI/CD Pipeline

### Automated Workflows

- **[CI Workflow](.github/workflows/ci.yml)**: Runs tests on multiple Node.js versions
- **[Pre-release Workflow](.github/workflows/pre-release.yml)**: Creates draft releases for release branches
- **[Release Workflow](.github/workflows/release.yml)**: Automated NPM publishing on version tags

### Branch Protection

- **Main branch**: Requires PR reviews and passing CI
- **Develop branch**: Requires passing CI
- **Feature branches**: Follow GitFlow model

See [Branch Strategy](.github/branch-strategy.md) for detailed workflow.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:

- Development setup and workflow
- Code quality standards
- Testing requirements
- Pull request process
- Platform-specific guidelines

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with tests
4. Run validation: `npm run validate`
5. Commit your changes: `git commit -m 'feat: add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📋 Issue Templates

- **[Bug Report](.github/ISSUE_TEMPLATE/bug_report.yml)** - Report bugs with detailed information
- **[Feature Request](.github/ISSUE_TEMPLATE/feature_request.yml)** - Suggest new features

## 🔒 Security

For security vulnerabilities, please see our [Security Policy](SECURITY.md) for responsible disclosure guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
- Follows [Conventional Commits](https://conventionalcommits.org/) specification
- Uses [Keep a Changelog](https://keepachangelog.com/) format

---

**Made with ❤️ for the React Native community**