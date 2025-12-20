cmake_minimum_required(VERSION 3.13)
set(CMAKE_VERBOSE_MAKEFILE on)

project(react-native-esim-manager)

# Find required packages for new architecture
find_package(ReactAndroid REQUIRED CONFIG)
find_package(fbjni REQUIRED CONFIG)

# Define source files
set(SOURCES
    cpp-adapter.cpp
    src/main/cpp/EsimManagerTurbo.cpp
)

add_library(react-native-esim-manager SHARED ${SOURCES})

# Include directories
target_include_directories(react-native-esim-manager
        PRIVATE
        "src/main/cpp"
        "${REACT_NATIVE_DIR}/ReactCommon"
        "${REACT_NATIVE_DIR}/ReactCommon/jsi"
        "${REACT_NATIVE_DIR}/ReactCommon/turbomodule/core"
        "${REACT_NATIVE_DIR}/ReactAndroid/src/main/jni/react/turbomodule"
)

# Link libraries
target_link_libraries(react-native-esim-manager
        ReactAndroid::jsi
        ReactAndroid::reactnativejni
        ReactAndroid::turbomodulejsijni
        fbjni::fbjni
        android
        log
)