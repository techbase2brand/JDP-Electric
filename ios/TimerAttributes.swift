//  TimerAttributes.swift
//  Electrician
//

import ActivityKit

struct TimerAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        var elapsedTime: Int
        var isRunning: Bool
    }
  var taskName: String
}
