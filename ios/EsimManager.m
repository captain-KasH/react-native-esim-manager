#import "EsimManager.h"
#import <CoreTelephony/CTTelephonyNetworkInfo.h>
#import <CoreTelephony/CTCarrier.h>
#import <CoreTelephony/CTCellularPlanProvisioning.h>

@implementation EsimManager

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(isEsimSupported:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
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
                  rejecter:(RCTPromiseRejectBlock)reject)
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
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    NSMutableDictionary *info = [[NSMutableDictionary alloc] init];
    
    // Check eSIM support
    BOOL supported = NO;
    if (@available(iOS 12.0, *)) {
        CTCellularPlanProvisioning *provisioning = [[CTCellularPlanProvisioning alloc] init];
        supported = provisioning.supportsCellularPlan;
    }
    info[@"isEsimSupported"] = @(supported);
    
    // Get carrier information
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
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
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
                  rejecter:(RCTPromiseRejectBlock)reject)
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

@end