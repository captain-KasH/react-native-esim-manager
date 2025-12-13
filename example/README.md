# eSIM Manager Example App

This is an example React Native app demonstrating the usage of `react-native-esim-manager` package.

## Features

- Check eSIM support and status
- Get detailed eSIM information
- Install eSIM profiles using activation codes
- View cellular plans on the device
- Test with sample activation codes

## Prerequisites

- React Native development environment set up
- iOS 12.0+ device or simulator (for eSIM installation testing)
- Android 9.0+ (API 28) device or emulator (for full eSIM support)
- Physical device recommended for real eSIM testing

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

## Step 3: Test eSIM functionality

Once the app is running, you can:

1. **Check eSIM Support**: Tap "Check Support" to see if your device supports eSIM
2. **View eSIM Info**: The app automatically loads eSIM information on startup
3. **Test Installation**: Use the provided test activation codes to test the installation flow
4. **View Cellular Plans**: Tap "Get Cellular Plans" to see active cellular subscriptions

### Test Activation Codes

The app includes several test activation codes you can use:
- Google Test: `LPA:1$prod.smdp-plus.rsp.goog$3TD6-8L82-HUE1-LVN6`
- GSMA Test: `LPA:1$lpa.ds.gsma.com$GSMA-TEST-PROFILE`

**Note**: Test codes may not actually install profiles but demonstrate the installation flow.

## Platform-Specific Notes

### iOS
- Requires iOS 12.0+ for eSIM installation
- Test on physical device for best results
- Installation shows native iOS eSIM dialog

### Android
- Requires API 28+ for full eSIM support
- Installation opens system settings
- Activation code is copied to clipboard automatically
- Grant phone state permission when prompted

# Troubleshooting

## Common Issues

1. **"eSIM not supported" on simulator**
   - Use a physical device for eSIM testing
   - iOS Simulator doesn't support eSIM functionality

2. **Permission denied on Android**
   - Grant "Phone" permission when prompted
   - Check that READ_PHONE_STATE permission is in AndroidManifest.xml

3. **Installation not working**
   - Ensure device supports eSIM (iOS 12.0+, Android API 28+)
   - Use valid activation codes (starting with "LPA:1$")
   - On Android, paste the activation code from clipboard in opened settings

4. **No carrier information shown**
   - Ensure eSIM profile is properly activated
   - Check device has active cellular connection

## Learn More

- [react-native-esim-manager Documentation](../README.md)
- [React Native eSIM Guide](https://reactnative.dev)
- [iOS eSIM Programming Guide](https://developer.apple.com/documentation/coretelephone)
- [Android eSIM API Documentation](https://developer.android.com/reference/android/telephony/euicc/EuiccManager)