package com.esimmanager;

import androidx.annotation.NonNull;
import com.facebook.react.TurboReactPackage;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.uimanager.ViewManager;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class EsimManagerPackage extends TurboReactPackage {

    @Override
    public NativeModule getModule(String name, @NonNull ReactApplicationContext reactContext) {
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            if (name.equals("EsimManagerSpec")) {
                try {
                    Class<?> turboModuleClass = Class.forName("com.esimmanager.EsimManagerTurboModule");
                    return (NativeModule) turboModuleClass.getConstructor(ReactApplicationContext.class).newInstance(reactContext);
                } catch (Exception e) {
                    return null;
                }
            }
        } else {
            if (name.equals("EsimManager")) {
                try {
                    Class<?> moduleClass = Class.forName("com.esimmanager.EsimManagerModule");
                    return (NativeModule) moduleClass.getConstructor(ReactApplicationContext.class).newInstance(reactContext);
                } catch (Exception e) {
                    return null;
                }
            }
        }
        return null;
    }

    @Override
    public ReactModuleInfoProvider getReactModuleInfoProvider() {
        return () -> {
            final Map<String, ReactModuleInfo> moduleInfos = new HashMap<>();
            if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
                moduleInfos.put(
                    "EsimManagerSpec",
                    new ReactModuleInfo(
                        "EsimManagerSpec",
                        "EsimManagerSpec",
                        false, // canOverrideExistingModule
                        false, // needsEagerInit
                        true,  // hasConstants
                        false, // isCxxModule
                        true   // isTurboModule
                    )
                );
            } else {
                moduleInfos.put(
                    "EsimManager",
                    new ReactModuleInfo(
                        "EsimManager",
                        "EsimManager",
                        false, // canOverrideExistingModule
                        false, // needsEagerInit
                        true,  // hasConstants
                        false, // isCxxModule
                        false  // isTurboModule
                    )
                );
            }
            return moduleInfos;
        };
    }

    @NonNull
    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}