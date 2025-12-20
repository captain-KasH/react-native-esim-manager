package com.esimmanager;

import android.content.Context;
import android.telephony.TelephonyManager;
import android.telephony.SubscriptionManager;
import android.telephony.SubscriptionInfo;
import android.os.Build;
import android.content.pm.PackageManager;
import androidx.core.content.ContextCompat;
import android.telephony.euicc.EuiccManager;
import android.content.Intent;
import android.app.Activity;
import android.telephony.euicc.DownloadableSubscription;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;

import java.util.List;

public class EsimManagerTurboModule extends NativeEsimManagerSpec {

    public static final String NAME = "EsimManager";
    private final ReactApplicationContext reactContext;

    public EsimManagerTurboModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    private boolean hasPhonePermission() {
        return ContextCompat.checkSelfPermission(reactContext, android.Manifest.permission.READ_PHONE_STATE) == PackageManager.PERMISSION_GRANTED;
    }

    @Override
    public void requestPermissions(Promise promise) {
        try {
            promise.resolve(hasPhonePermission());
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    @Override
    public void isEsimSupported(Promise promise) {
        try {
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.P) {
                promise.resolve(false);
                return;
            }

            EuiccManager euiccManager =
                    (EuiccManager) reactContext.getSystemService(Context.EUICC_SERVICE);

            if (euiccManager == null) {
                promise.resolve(false);
                return;
            }

            if (!euiccManager.isEnabled()) {
                promise.resolve(false);
                return;
            }

            boolean hasEuiccFeature =
                    reactContext.getPackageManager()
                            .hasSystemFeature(PackageManager.FEATURE_TELEPHONY_EUICC);

            promise.resolve(hasEuiccFeature);

        } catch (Exception e) {
            promise.reject("ESIM_ERROR", e.getMessage());
        }
    }

    @Override
    public void isEsimEnabled(Promise promise) {
        try {
            if (!hasPhonePermission()) {
                promise.reject("PERMISSION_DENIED", "read_phone_state permission is required");
                return;
            }
            
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP_MR1) {
                SubscriptionManager subscriptionManager = SubscriptionManager.from(reactContext);
                List<SubscriptionInfo> subscriptions = subscriptionManager.getActiveSubscriptionInfoList();
                
                if (subscriptions != null) {
                    for (SubscriptionInfo info : subscriptions) {
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P && info.isEmbedded()) {
                            promise.resolve(true);
                            return;
                        }
                    }
                }
            }
            promise.resolve(false);
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    @Override
    public void getEsimInfo(Promise promise) {
        try {
            WritableMap info = Arguments.createMap();
            
            boolean supported = false;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                TelephonyManager telephonyManager = (TelephonyManager) reactContext.getSystemService(Context.TELEPHONY_SERVICE);
                if (telephonyManager != null) {
                    supported = telephonyManager.isMultiSimSupported() != TelephonyManager.MULTISIM_NOT_SUPPORTED_BY_HARDWARE;
                }
            }
            info.putBoolean("isEsimSupported", supported);

            boolean hasEsim = false;
            String carrierName = null;
            String mcc = null;
            String mnc = null;

            if (hasPhonePermission() && Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP_MR1) {
                SubscriptionManager subscriptionManager = SubscriptionManager.from(reactContext);
                List<SubscriptionInfo> subscriptions = subscriptionManager.getActiveSubscriptionInfoList();
                
                if (subscriptions != null) {
                    for (SubscriptionInfo subInfo : subscriptions) {
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P && subInfo.isEmbedded()) {
                            hasEsim = true;
                            carrierName = subInfo.getCarrierName().toString();
                            mcc = String.valueOf(subInfo.getMcc());
                            mnc = String.valueOf(subInfo.getMnc());
                            break;
                        }
                    }
                }
            }

            info.putBoolean("isEsimEnabled", hasEsim);
            if (carrierName != null) info.putString("carrierName", carrierName);
            if (mcc != null) info.putString("mobileCountryCode", mcc);
            if (mnc != null) info.putString("mobileNetworkCode", mnc);

            promise.resolve(info);
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    @Override
    public void installEsimProfile(ReadableMap data, Promise promise) {
        try {
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.P) {
                promise.reject("VERSION_NOT_SUPPORTED", "Android 9.0 (API 28) or higher is required");
                return;
            }

            EuiccManager euiccManager = (EuiccManager) reactContext.getSystemService(Context.EUICC_SERVICE);
            
            if (euiccManager == null) {
                promise.reject("NOT_SUPPORTED", "EuiccManager not available");
                return;
            }

            if (!euiccManager.isEnabled()) {
                promise.reject("NOT_SUPPORTED", "eSIM is not enabled on this device");
                return;
            }

            String activationCode = data.getString("activationCode");
            
            if (activationCode == null || activationCode.isEmpty()) {
                promise.reject("INVALID_ACTIVATION_CODE", "Activation code is required");
                return;
            }

            Activity currentActivity = reactContext.getCurrentActivity();
            if (currentActivity == null) {
                promise.reject("NO_ACTIVITY", "No current activity available");
                return;
            }

            // Copy activation code to clipboard
            android.content.ClipboardManager clipboard = (android.content.ClipboardManager) reactContext.getSystemService(Context.CLIPBOARD_SERVICE);
            if (clipboard != null) {
                android.content.ClipData clip = android.content.ClipData.newPlainText("eSIM Activation Code", activationCode);
                clipboard.setPrimaryClip(clip);
            }
            
            // Try direct eSIM installation first
            try {
                DownloadableSubscription subscription = DownloadableSubscription.forActivationCode(activationCode);
                Intent intent = new Intent("android.telephony.euicc.action.PROVISION_EMBEDDED_SUBSCRIPTION");
                intent.putExtra("android.telephony.euicc.extra.EMBEDDED_SUBSCRIPTION_DOWNLOADABLE_SUBSCRIPTION", subscription);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                currentActivity.startActivity(intent);
                promise.resolve(true);
                return;
            } catch (Exception e1) {
                // Fallback to eSIM settings
                try {
                    Intent intent = new Intent("android.settings.EUICC_SETTINGS");
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    currentActivity.startActivity(intent);
                    promise.resolve(true);
                    return;
                } catch (Exception e2) {
                    // Fallback to SIM settings
                    try {
                        Intent intent = new Intent("android.settings.SIM_SETTINGS");
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        currentActivity.startActivity(intent);
                        promise.resolve(true);
                        return;
                    } catch (Exception e3) {
                        // Final fallback to wireless settings
                        try {
                            Intent intent = new Intent(android.provider.Settings.ACTION_WIRELESS_SETTINGS);
                            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                            currentActivity.startActivity(intent);
                            promise.resolve(true);
                            return;
                        } catch (Exception e4) {
                            promise.reject("SETTINGS_FAILED", "Could not open any settings: " + e4.getMessage());
                        }
                    }
                }
            }
        } catch (Exception e) {
            promise.reject("ERROR", "Installation failed: " + e.getMessage());
        }
    }

    @Override
    public void getCellularPlans(Promise promise) {
        try {
            if (!hasPhonePermission()) {
                promise.reject("PERMISSION_DENIED", "read_phone_state permission is required");
                return;
            }
            
            WritableArray plans = Arguments.createArray();
            
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP_MR1) {
                SubscriptionManager subscriptionManager = SubscriptionManager.from(reactContext);
                List<SubscriptionInfo> subscriptions = subscriptionManager.getActiveSubscriptionInfoList();
                
                if (subscriptions != null) {
                    for (SubscriptionInfo info : subscriptions) {
                        WritableMap plan = Arguments.createMap();
                        plan.putString("carrierName", info.getCarrierName().toString());
                        plan.putString("mobileCountryCode", String.valueOf(info.getMcc()));
                        plan.putString("mobileNetworkCode", String.valueOf(info.getMnc()));
                        plan.putInt("subscriptionId", info.getSubscriptionId());
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                            plan.putBoolean("isEmbedded", info.isEmbedded());
                        }
                        plans.pushMap(plan);
                    }
                }
            }
            
            promise.resolve(plans);
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }
}