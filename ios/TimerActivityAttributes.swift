//
//  TimerActivityAttributes.swift
//  Electrician
//
//  Created by Rahul   on 29/08/25.
//


import ActivityKit
import Foundation

struct TimerActivityAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        var startTime: Date
        var isRunning: Bool
    }
    var title: String
}
