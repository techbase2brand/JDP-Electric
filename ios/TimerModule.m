//
//  TimerModule.m
//  Electrician
//

#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(TimerModule, NSObject)

RCT_EXTERN_METHOD(startActivity:(nonnull NSNumber *)elapsedTime
                  jobName:(NSString *)jobName
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(updateActivity:(nonnull NSNumber *)elapsedTime
                  isRunning:(BOOL)isRunning)

RCT_EXTERN_METHOD(endActivity)

@end
