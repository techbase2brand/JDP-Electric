//
//  DynamicIslandModule.swift
//  Electrician
//
//  Created by Rahul   on 29/08/25.
//

import Foundation
import ActivityKit

@objc(DynamicIslandModule)
class DynamicIslandModule: NSObject {
    
    private var activity: Activity<TimerActivityAttributes>?
    
    // Start Timer from RN
    @objc(startTimer:isRunning:)
    func startTimer(startTimestamp: NSNumber, isRunning: Bool) {
        guard ActivityAuthorizationInfo().areActivitiesEnabled else {
            print("⚠️ Live Activities not enabled")
            return
        }
        
        let attributes = TimerActivityAttributes(title: "Work Timer")
        let state = TimerActivityAttributes.ContentState(
            startTime: Date(timeIntervalSince1970: startTimestamp.doubleValue / 1000.0),
            isRunning: isRunning
        )
        
        do {
            activity = try Activity<TimerActivityAttributes>.request(
                attributes: attributes,
                contentState: state,
                pushType: nil
            )
            print("✅ Live Activity started")
        } catch {
            print("❌ Failed: \(error)")
        }
    }
    
    // Update running/paused state
    @objc(updateTimer:isRunning:)
    func updateTimer(startTimestamp: NSNumber, isRunning: Bool) {
        Task {
            let state = TimerActivityAttributes.ContentState(
                startTime: Date(timeIntervalSince1970: startTimestamp.doubleValue / 1000.0),
                isRunning: isRunning
            )
            await activity?.update(using: state)
            print("🔄 Timer updated (running=\(isRunning))")
        }
    }
}

