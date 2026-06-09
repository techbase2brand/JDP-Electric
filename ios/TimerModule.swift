//
//  TimerModule.swift
//  Electrician
//

import Foundation
import ActivityKit

@objc(TimerModule)
class TimerModule: NSObject {
  private var activity: Activity<TimerAttributes>?

  @available(iOS 16.1, *)
  private func endAllTimerActivities() async {
    if let current = activity {
      await current.end(dismissalPolicy: .immediate)
    }
    for existing in Activity<TimerAttributes>.activities {
      await existing.end(dismissalPolicy: .immediate)
    }
    activity = nil
  }

  @available(iOS 16.1, *)
  private func resolveActiveActivity() -> Activity<TimerAttributes>? {
    if let activity = activity {
      return activity
    }
    let systemActivity = Activity<TimerAttributes>.activities.first
    activity = systemActivity
    return systemActivity
  }

  @objc
  func startActivity(
    _ elapsedTime: NSNumber,
    jobName: String,
    resolver: @escaping RCTPromiseResolveBlock,
    rejecter: @escaping RCTPromiseRejectBlock
  ) {
    if #available(iOS 16.1, *) {
      Task {
        await self.endAllTimerActivities()

        let title = jobName.trimmingCharacters(in: .whitespacesAndNewlines)
        let displayName = title.isEmpty ? "Work" : title

        let attributes = TimerAttributes(taskName: displayName)
        let state = TimerAttributes.ContentState(
          elapsedTime: elapsedTime.intValue,
          isRunning: true,
          statusMessage: ""
        )
        do {
          self.activity = try Activity<TimerAttributes>.request(
            attributes: attributes,
            contentState: state,
            pushType: nil
          )
          resolver("Live Activity started")
        } catch {
          rejecter("ERR", "Could not start Live Activity", error)
        }
      }
    } else {
      rejecter("ERR", "Live Activities not supported on this iOS", nil)
    }
  }

  @objc
  func updateActivity(
    _ elapsedTime: NSNumber,
    isRunning: Bool,
    statusMessage: String?
  ) {
    if #available(iOS 16.1, *) {
      Task {
        let state = TimerAttributes.ContentState(
          elapsedTime: elapsedTime.intValue,
          isRunning: isRunning,
          statusMessage: statusMessage ?? ""
        )
        guard let active = self.resolveActiveActivity() else { return }
        await active.update(using: state)
      }
    }
  }

  @objc
  func endActivity(
    _ resolver: @escaping RCTPromiseResolveBlock,
    rejecter: @escaping RCTPromiseRejectBlock
  ) {
    if #available(iOS 16.1, *) {
      Task {
        await self.endAllTimerActivities()
        resolver(true)
      }
    } else {
      resolver(true)
    }
  }
}
