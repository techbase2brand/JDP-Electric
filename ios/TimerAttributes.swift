//  TimerAttributes.swift
//  Electrician
//

import ActivityKit

struct TimerAttributes: ActivityAttributes {
  public struct ContentState: Codable, Hashable {
    var elapsedTime: Int
    var isRunning: Bool
    /// Shown on lock screen when timer paused (e.g. location off). Empty = normal UI.
    var statusMessage: String
  }

  /// Job title shown on lock screen & Dynamic Island.
  var taskName: String
}
