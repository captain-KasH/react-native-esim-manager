#ifdef RCT_NEW_ARCH_ENABLED
#import <EsimManagerSpec/EsimManagerSpec.h>
@interface EsimManager : NSObject <NativeEsimManagerSpec>
#else
#import <React/RCTBridgeModule.h>
@interface EsimManager : NSObject <RCTBridgeModule>
#endif

@end