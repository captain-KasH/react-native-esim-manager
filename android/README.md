# Android Module Setup

## New Architecture (TurboModules) Support

This module now properly supports React Native's new architecture with the following components:

### Key Files Added/Updated:

1. **C++ TurboModule Implementation**:
   - `src/main/cpp/EsimManagerTurbo.h`
   - `src/main/cpp/EsimManagerTurbo.cpp`
   - Updated `cpp-adapter.cpp`

2. **Architecture-Specific Java Code**:
   - `src/newarch/java/com/esimmanager/` - New architecture (TurboModules)
   - `src/oldarch/java/com/esimmanager/` - Legacy bridge

3. **Build Configuration**:
   - Updated `build.gradle` with proper new architecture support
   - Improved `CMakeLists.txt` with correct dependencies
   - Added `gradle.properties` with module configuration
   - Added `proguard-rules.pro` for release builds

4. **Configuration Files**:
   - `react-native.config.js` - Module configuration
   - Updated `package.json` with codegen config

### Build Requirements:

- Android Gradle Plugin 8.1.1+
- CMake 3.18.1+
- NDK 25.1.8937393+
- Min SDK 28 (Android 9.0)
- Compile SDK 34

### Usage:

The module automatically detects the architecture and uses the appropriate implementation:
- **New Architecture**: Uses TurboModule with C++ JSI bindings
- **Legacy**: Uses standard React Native bridge

No changes required in JavaScript code - the API remains the same.