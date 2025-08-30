//
//  TimerAttributes.swift
//  Electrician
//
//  Created by Rahul   on 30/08/25.
//

import ActivityKit

struct TimerAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        var elapsedTime: Int
        var isRunning: Bool
    }
  var taskName: String
}
