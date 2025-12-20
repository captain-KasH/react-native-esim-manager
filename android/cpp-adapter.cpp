#include <jni.h>
#include <fbjni/fbjni.h>
#include <ReactCommon/TurboModuleManagerDelegate.h>
#include "src/main/cpp/EsimManagerTurbo.h"

using namespace facebook;
using namespace facebook::react;

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM *vm, void *) {
    return jni::initialize(vm, [] {
        // Register TurboModule for new architecture
    });
}