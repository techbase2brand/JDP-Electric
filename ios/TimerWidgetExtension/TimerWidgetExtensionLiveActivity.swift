//
//  TimerWidgetExtensionLiveActivity.swift
//  TimerWidgetExtension
//
//  Created by Rahul   on 18/03/26.
//

import ActivityKit
import WidgetKit
import SwiftUI

struct TimerWidgetExtensionLiveActivity: Widget {
    var body: some WidgetConfiguration {
        // IMPORTANT:
        // The app (via `TimerModule`) starts/updates the Live Activity using `TimerAttributes`.
        // So the widget must also be configured for `TimerAttributes` (not the Xcode template attributes).
        ActivityConfiguration(for: TimerAttributes.self) { context in
            let startDate = Date().addingTimeInterval(-Double(context.state.elapsedTime))

            // Lock Screen UI
            VStack(spacing: 8) {
                Text(context.attributes.taskName)
                    .font(.headline)
                    .foregroundColor(.green)

                Text(timerInterval: startDate...Date.distantFuture, countsDown: false)
                    .font(.title2)
                    .bold()
                    .foregroundColor(.green)
                    .monospacedDigit()
            }
            .padding()
            .activityBackgroundTint(Color.black)
            .activitySystemActionForegroundColor(Color.green)

        } dynamicIsland: { context in
            let startDate = Date().addingTimeInterval(-Double(context.state.elapsedTime))

            return DynamicIsland {
                DynamicIslandExpandedRegion(.center) {
                    Text(timerInterval: startDate...Date.distantFuture, countsDown: false)
                        .foregroundColor(.green)
                        .font(.headline)
                        .monospacedDigit()
                }
            } compactLeading: {
                Text("⏱")
                    .foregroundColor(.green)
            } compactTrailing: {
                Text(timerInterval: startDate...Date.distantFuture, countsDown: false)
                    .foregroundColor(.green)
                    .monospacedDigit()
            } minimal: {
                Text("⏱")
                    .foregroundColor(.green)
            }
        }
    }
}
