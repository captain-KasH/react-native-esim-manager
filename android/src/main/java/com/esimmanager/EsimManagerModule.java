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
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;

import java.util.List;

public class EsimManagerModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public EsimManagerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    @NonNull
    public String getName() {
        return "EsimManager";
    }

    private boolean hasPhonePermission() {
        return ContextCompat.checkSelfPermission(reactContext, android.Manifest.permission.READ_PHONE_STATE) == PackageManager.PERMISSION_GRANTED;
    }

    @ReactMethod
    public void requestPermissions(Promise promise) {
        try {
            promise.resolve(hasPhonePermission());
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void isEsimSupported(Promise promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                TelephonyManager telephonyManager = (TelephonyManager) reactContext.getSystemService(Context.TELEPHONY_SERVICE);
                if (telephonyManager != null) {
                    boolean supported = telephonyManager.isMultiSimSupported() != TelephonyManager.MULTISIM_NOT_SUPPORTED_BY_HARDWARE;
                    promise.resolve(supported);
                } else {
                    promise.resolve(false);
                }
            } else {
                promise.resolve(false);
            }
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    @ReactMethod
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

    @ReactMethod
    public void getEsimInfo(Promise promise) {
        try {
            WritableMap info = Arguments.createMap();
            
            // Check eSIM support
            boolean supported = false;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                TelephonyManager telephonyManager = (TelephonyManager) reactContext.getSystemService(Context.TELEPHONY_SERVICE);
                if (telephonyManager != null) {
                    supported = telephonyManager.isMultiSimSupported() != TelephonyManager.MULTISIM_NOT_SUPPORTED_BY_HARDWARE;
                }
            }
            info.putBoolean("isEsimSupported", supported);

            // Check if eSIM is enabled and get carrier info
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

    @ReactMethod
    public void installEsimProfile(ReadableMap data, Promise promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                EuiccManager euiccManager = (EuiccManager) reactContext.getSystemService(Context.EUICC_SERVICE);
                
                if (euiccManager != null && euiccManager.isEnabled()) {
                    String activationCode = data.getString("activationCode");
                    
                    if (activationCode != null && !activationCode.isEmpty()) {
                        DownloadableSubscription subscription = DownloadableSubscription.forActivationCode(activationCode);
                        
                        Activity currentActivity = getCurrentActivity();
                        if (currentActivity != null) {
                            // Copy activation code to clipboard for easy pasting
                            android.content.ClipboardManager clipboard = (android.content.ClipboardManager) reactContext.getSystemService(Context.CLIPBOARD_SERVICE);
                            android.content.ClipData clip = android.content.ClipData.newPlainText("eSIM Activation Code", activationCode);
                            clipboard.setPrimaryClip(clip);
                            
                            try {
                                // Try direct eSIM installation intent first
                                Intent intent = new Intent("android.telephony.euicc.action.PROVISION_EMBEDDED_SUBSCRIPTION");
                                intent.putExtra("android.telephony.euicc.extra.EMBEDDED_SUBSCRIPTION_DOWNLOADABLE_SUBSCRIPTION", subscription);
                                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                                currentActivity.startActivity(intent);
                                promise.resolve(true);
                            } catch (Exception e1) {
                                try {
                                    // Try eSIM-specific settings page
                                    Intent intent = new Intent("android.settings.EUICC_SETTINGS");
                                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                                    currentActivity.startActivity(intent);
                                    promise.resolve(true);
                                } catch (Exception e2) {
                                    try {
                                        // Try SIM settings with add eSIM action
                                        Intent intent = new Intent("android.settings.SIM_SETTINGS");
                                        intent.putExtra("android.provider.extra.SIM_STATE", "ADD_SIM");
                                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                                        currentActivity.startActivity(intent);
                                        promise.resolve(true);
                                    } catch (Exception e3) {
                                        try {
                                            // Fallback to general SIM settings
                                            Intent intent = new Intent(android.provider.Settings.ACTION_WIRELESS_SETTINGS);
                                            intent.putExtra(":settings:show_fragment", "com.android.settings.sim.SimSettings");
                                            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                                            currentActivity.startActivity(intent);
                                            promise.resolve(true);
                                        } catch (Exception e4) {
                                            promise.reject("SETTINGS_FAILED", "Could not open any settings page");
                                        }
                                    }
                                }
                            }
                        } else {
                            promise.reject("NO_ACTIVITY", "No current activity available");
                        }
                    } else {
                        promise.reject("INVALID_ACTIVATION_CODE", "Activation code is required");
                    }
                } else {
                    promise.reject("NOT_SUPPORTED", "eSIM is not supported or enabled on this device");
                }
            } else {
                promise.reject("VERSION_NOT_SUPPORTED", "Android 9.0 (API 28) or higher is required");
            }
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    @ReactMethod
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