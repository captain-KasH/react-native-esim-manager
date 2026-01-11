package com.esimmanager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.turbomodule.core.interfaces.TurboModule;

public abstract class NativeEsimManagerSpec extends ReactContextBaseJavaModule implements TurboModule {

    public static final String NAME = "EsimManagerSpec";

    public NativeEsimManagerSpec(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return NAME;
    }

    public abstract void requestPermissions(Promise promise);
    public abstract void isEsimSupported(Promise promise);
    public abstract void isEsimEnabled(Promise promise);
    public abstract void getEsimInfo(Promise promise);
    public abstract void installEsimProfile(ReadableMap data, Promise promise);
    public abstract void getCellularPlans(Promise promise);
}