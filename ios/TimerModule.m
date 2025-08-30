//
//  TimerModule.m
//  Electrician
//
//  Created by Rahul   on 30/08/25.
//

#import "React/RCTBridgeModule.h"
#import "React/RCTLog.h"

@interface RCT_EXTERN_MODULE(TimerModule, NSObject)

RCT_EXTERN_METHOD(startActivity:(nonnull NSNumber *)elapsedTime
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(updateActivity:(nonnull NSNumber *)elapsedTime
                  isRunning:(BOOL)isRunning)

RCT_EXTERN_METHOD(endActivity)

@end

