#import "EsimManager.h"
#import <CoreTelephony/CTTelephonyNetworkInfo.h>
#import <CoreTelephony/CTCarrier.h>
#import <CoreTelephony/CTCellularPlanProvisioning.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <EsimManagerSpec/EsimManagerSpec.h>
#import <React/RCTConvert.h>
#endif

@implementation EsimManager

RCT_EXPORT_MODULE()

#ifdef RCT_NEW_ARCH_ENABLED

- (void)requestPermissions:(RCTPromiseResolveBlock)resolve
                    reject:(RCTPromiseRejectBlock)reject
{
    resolve(@(YES));
}

- (void)isEsimSupported:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject
{
    if (@available(iOS 12.0, *)) {
        CTCellularPlanProvisioning *provisioning = [[CTCellularPlanProvisioning alloc] init];
        BOOL supported = provisioning.supportsCellularPlan;
        resolve(@(supported));
    } else {
        resolve(@(NO));
    }
}

- (void)isEsimEnabled:(RCTPromiseResolveBlock)resolve
               reject:(RCTPromiseRejectBlock)reject
{
    CTTelephonyNetworkInfo *networkInfo = [[CTTelephonyNetworkInfo alloc] init];
    NSDictionary *carriers = networkInfo.serviceSubscriberCellularProviders;
    
    BOOL hasEsim = NO;
    for (NSString *key in carriers) {
        CTCarrier *carrier = carriers[key];
        if (carrier && carrier.carrierName) {
            hasEsim = YES;
            break;
        }
    }
    
    resolve(@(hasEsim));
}

- (void)getEsimInfo:(RCTPromiseResolveBlock)resolve
             reject:(RCTPromiseRejectBlock)reject
{
    NSMutableDictionary *info = [[NSMutableDictionary alloc] init];
    
    BOOL supported = NO;
    if (@available(iOS 12.0, *)) {
        CTCellularPlanProvisioning *provisioning = [[CTCellularPlanProvisioning alloc] init];
        supported = provisioning.supportsCellularPlan;
    }
    info[@"isEsimSupported"] = @(supported);
    
    CTTelephonyNetworkInfo *networkInfo = [[CTTelephonyNetworkInfo alloc] init];
    NSDictionary *carriers = networkInfo.serviceSubscriberCellularProviders;
    
    BOOL hasEsim = NO;
    NSString *carrierName = nil;
    NSString *mcc = nil;
    NSString *mnc = nil;
    
    for (NSString *key in carriers) {
        CTCarrier *carrier = carriers[key];
        if (carrier && carrier.carrierName) {
            hasEsim = YES;
            carrierName = carrier.carrierName;
            mcc = carrier.mobileCountryCode;
            mnc = carrier.mobileNetworkCode;
            break;
        }
    }
    
    info[@"isEsimEnabled"] = @(hasEsim);
    if (carrierName) info[@"carrierName"] = carrierName;
    if (mcc) info[@"mobileCountryCode"] = mcc;
    if (mnc) info[@"mobileNetworkCode"] = mnc;
    
    resolve(info);
}

- (void)installEsimProfile:(JS::NativeEsimManager::EsimInstallationData &)data
                   resolve:(RCTPromiseResolveBlock)resolve
                    reject:(RCTPromiseRejectBlock)reject
{
    if (@available(iOS 12.0, *)) {
        CTCellularPlanProvisioning *provisioning = [[CTCellularPlanProvisioning alloc] init];
        
        if (!provisioning.supportsCellularPlan) {
            reject(@"ESIM_NOT_SUPPORTED", @"eSIM is not supported on this device", nil);
            return;
        }
        
        NSString *activationCode = data.activationCode();
        if (!activationCode) {
            reject(@"INVALID_ACTIVATION_CODE", @"Activation code is required", nil);
            return;
        }
        
        CTCellularPlanProvisioningRequest *request = [[CTCellularPlanProvisioningRequest alloc] init];
        request.address = activationCode;
        
        NSString *confirmationCode = data.confirmationCode();
        if (confirmationCode) {
            request.matchingID = confirmationCode;
        }
        
        [provisioning addPlanWith:request completionHandler:^(CTCellularPlanProvisioningAddPlanResult result) {
            dispatch_async(dispatch_get_main_queue(), ^{
                switch (result) {
                    case CTCellularPlanProvisioningAddPlanResultSuccess:
                        resolve(@(YES));
                        break;
                    case CTCellularPlanProvisioningAddPlanResultFail:
                        reject(@"INSTALLATION_FAILED", @"Failed to install eSIM profile", nil);
                        break;
                    case CTCellularPlanProvisioningAddPlanResultCancel:
                        reject(@"INSTALLATION_CANCELLED", @"eSIM installation was cancelled", nil);
                        break;
                    default:
                        reject(@"UNKNOWN_ERROR", @"Unknown error occurred", nil);
                        break;
                }
            });
        }];
    } else {
        reject(@"IOS_VERSION_NOT_SUPPORTED", @"iOS 12.0 or later is required", nil);
    }
}

- (void)getCellularPlans:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject
{
    CTTelephonyNetworkInfo *networkInfo = [[CTTelephonyNetworkInfo alloc] init];
    NSDictionary *carriers = networkInfo.serviceSubscriberCellularProviders;
    
    NSMutableArray *plans = [[NSMutableArray alloc] init];
    
    for (NSString *key in carriers) {
        CTCarrier *carrier = carriers[key];
        if (carrier) {
            NSMutableDictionary *plan = [[NSMutableDictionary alloc] init];
            if (carrier.carrierName) plan[@"carrierName"] = carrier.carrierName;
            if (carrier.mobileCountryCode) plan[@"mobileCountryCode"] = carrier.mobileCountryCode;
            if (carrier.mobileNetworkCode) plan[@"mobileNetworkCode"] = carrier.mobileNetworkCode;
            plan[@"slotId"] = key;
            [plans addObject:plan];
        }
    }
    
    resolve(plans);
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeEsimManagerSpecJSI>(params);
}

#else

RCT_EXPORT_METHOD(requestPermissions:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    resolve(@(YES));
}

RCT_EXPORT_METHOD(isEsimSupported:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    if (@available(iOS 12.0, *)) {
        CTCellularPlanProvisioning *provisioning = [[CTCellularPlanProvisioning alloc] init];
        BOOL supported = provisioning.supportsCellularPlan;
        resolve(@(supported));
    } else {
        resolve(@(NO));
    }
}

RCT_EXPORT_METHOD(isEsimEnabled:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    CTTelephonyNetworkInfo *networkInfo = [[CTTelephonyNetworkInfo alloc] init];
    NSDictionary *carriers = networkInfo.serviceSubscriberCellularProviders;
    
    BOOL hasEsim = NO;
    for (NSString *key in carriers) {
        CTCarrier *carrier = carriers[key];
        if (carrier && carrier.carrierName) {
            hasEsim = YES;
            break;
        }
    }
    
    resolve(@(hasEsim));
}

RCT_EXPORT_METHOD(getEsimInfo:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    NSMutableDictionary *info = [[NSMutableDictionary alloc] init];
    
    BOOL supported = NO;
    if (@available(iOS 12.0, *)) {
        CTCellularPlanProvisioning *provisioning = [[CTCellularPlanProvisioning alloc] init];
        supported = provisioning.supportsCellularPlan;
    }
    info[@"isEsimSupported"] = @(supported);
    
    CTTelephonyNetworkInfo *networkInfo = [[CTTelephonyNetworkInfo alloc] init];
    NSDictionary *carriers = networkInfo.serviceSubscriberCellularProviders;
    
    BOOL hasEsim = NO;
    NSString *carrierName = nil;
    NSString *mcc = nil;
    NSString *mnc = nil;
    
    for (NSString *key in carriers) {
        CTCarrier *carrier = carriers[key];
        if (carrier && carrier.carrierName) {
            hasEsim = YES;
            carrierName = carrier.carrierName;
            mcc = carrier.mobileCountryCode;
            mnc = carrier.mobileNetworkCode;
            break;
        }
    }
    
    info[@"isEsimEnabled"] = @(hasEsim);
    if (carrierName) info[@"carrierName"] = carrierName;
    if (mcc) info[@"mobileCountryCode"] = mcc;
    if (mnc) info[@"mobileNetworkCode"] = mnc;
    
    resolve(info);
}

RCT_EXPORT_METHOD(installEsimProfile:(NSDictionary *)data
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    if (@available(iOS 12.0, *)) {
        CTCellularPlanProvisioning *provisioning = [[CTCellularPlanProvisioning alloc] init];
        
        if (!provisioning.supportsCellularPlan) {
            reject(@"ESIM_NOT_SUPPORTED", @"eSIM is not supported on this device", nil);
            return;
        }
        
        NSString *activationCode = data[@"activationCode"];
        if (!activationCode) {
            reject(@"INVALID_ACTIVATION_CODE", @"Activation code is required", nil);
            return;
        }
        
        CTCellularPlanProvisioningRequest *request = [[CTCellularPlanProvisioningRequest alloc] init];
        request.address = activationCode;
        
        NSString *confirmationCode = data[@"confirmationCode"];
        if (confirmationCode) {
            request.matchingID = confirmationCode;
        }
        
        [provisioning addPlanWith:request completionHandler:^(CTCellularPlanProvisioningAddPlanResult result) {
            dispatch_async(dispatch_get_main_queue(), ^{
                switch (result) {
                    case CTCellularPlanProvisioningAddPlanResultSuccess:
                        resolve(@(YES));
                        break;
                    case CTCellularPlanProvisioningAddPlanResultFail:
                        reject(@"INSTALLATION_FAILED", @"Failed to install eSIM profile", nil);
                        break;
                    case CTCellularPlanProvisioningAddPlanResultCancel:
                        reject(@"INSTALLATION_CANCELLED", @"eSIM installation was cancelled", nil);
                        break;
                    default:
                        reject(@"UNKNOWN_ERROR", @"Unknown error occurred", nil);
                        break;
                }
            });
        }];
    } else {
        reject(@"IOS_VERSION_NOT_SUPPORTED", @"iOS 12.0 or later is required", nil);
    }
}

RCT_EXPORT_METHOD(getCellularPlans:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    CTTelephonyNetworkInfo *networkInfo = [[CTTelephonyNetworkInfo alloc] init];
    NSDictionary *carriers = networkInfo.serviceSubscriberCellularProviders;
    
    NSMutableArray *plans = [[NSMutableArray alloc] init];
    
    for (NSString *key in carriers) {
        CTCarrier *carrier = carriers[key];
        if (carrier) {
            NSMutableDictionary *plan = [[NSMutableDictionary alloc] init];
            if (carrier.carrierName) plan[@"carrierName"] = carrier.carrierName;
            if (carrier.mobileCountryCode) plan[@"mobileCountryCode"] = carrier.mobileCountryCode;
            if (carrier.mobileNetworkCode) plan[@"mobileNetworkCode"] = carrier.mobileNetworkCode;
            plan[@"slotId"] = key;
            [plans addObject:plan];
        }
    }
    
    resolve(plans);
}

#endif

+ (BOOL)requiresMainQueueSetup
{
    return NO;
}

@end