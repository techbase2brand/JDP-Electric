//
//  TimerModule.swift
//  Electrician
//

import Foundation
import ActivityKit

@objc(TimerModule)
class TimerModule: NSObject {
  private var activity: Activity<TimerAttributes>?

  @objc
  func startActivity(
    _ elapsedTime: NSNumber,
    jobName: String,
    resolver: @escaping RCTPromiseResolveBlock,
    rejecter: @escaping RCTPromiseRejectBlock
  ) {
    if #available(iOS 16.1, *) {
      let title = jobName.trimmingCharacters(in: .whitespacesAndNewlines)
      let displayName = title.isEmpty ? "Work" : title

      let attributes = TimerAttributes(taskName: displayName)
      let state = TimerAttributes.ContentState(
        elapsedTime: elapsedTime.intValue,
        isRunning: true
      )
      do {
        activity = try Activity<TimerAttributes>.request(
          attributes: attributes,
          contentState: state,
          pushType: nil
        )
        resolver("Live Activity started")
      } catch {
        rejecter("ERR", "Could not start Live Activity", error)
      }
    } else {
      rejecter("ERR", "Live Activities not supported on this iOS", nil)
    }
  }

  @objc
  func updateActivity(_ elapsedTime: NSNumber, isRunning: Bool) {
    if #available(iOS 16.1, *) {
      Task {
        let state = TimerAttributes.ContentState(
          elapsedTime: elapsedTime.intValue,
          isRunning: isRunning
        )
        await activity?.update(using: state)
      }
    }
  }

  @objc
  func endActivity() {
    if #available(iOS 16.1, *) {
      Task {
        await activity?.end(dismissalPolicy: .immediate)
        activity = nil
      }
    }
  }
}
