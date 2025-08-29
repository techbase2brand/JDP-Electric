//
//  DynamicIslandModule.m
//  Electrician
//
//  Created by Rahul   on 29/08/25.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(DynamicIslandModule, NSObject)

RCT_EXTERN_METHOD(startTimer:(nonnull NSNumber *)startTimestamp isRunning:(BOOL)isRunning)
RCT_EXTERN_METHOD(updateTimer:(nonnull NSNumber *)startTimestamp isRunning:(BOOL)isRunning)

@end

