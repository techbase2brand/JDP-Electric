//
//  TimerWidgetExtensionLiveActivity.swift
//  TimerWidgetExtension
//

import ActivityKit
import WidgetKit
import SwiftUI

struct TimerWidgetExtensionLiveActivity: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: TimerAttributes.self) { context in
      let startDate = Date().addingTimeInterval(-Double(context.state.elapsedTime))
      let jobName = context.attributes.taskName
      let statusText = context.state.isRunning ? "Running" : "Paused"

      // Lock screen
      VStack(alignment: .leading, spacing: 8) {
        Text(jobName)
          .font(.headline)
          .foregroundColor(.white)
          .lineLimit(2)

        Text(timerInterval: startDate...Date.distantFuture, countsDown: false)
          .font(.title2)
          .bold()
          .foregroundColor(.green)
          .monospacedDigit()

        Text(statusText)
          .font(.caption)
          .foregroundColor(.gray)
      }
      .frame(maxWidth: .infinity, alignment: .leading)
      .padding()
      .activityBackgroundTint(Color.black)
      .activitySystemActionForegroundColor(Color.green)

    } dynamicIsland: { context in
      let startDate = Date().addingTimeInterval(-Double(context.state.elapsedTime))
      let jobName = context.attributes.taskName
      let statusText = context.state.isRunning ? "Running" : "Paused"

      return DynamicIsland {
        DynamicIslandExpandedRegion(.leading) {
          VStack(alignment: .leading, spacing: 4) {
            Text("JDP Electric")
              .font(.caption2)
              .foregroundColor(.gray)
            Text(jobName)
              .font(.subheadline)
              .bold()
              .foregroundColor(.white)
              .lineLimit(2)
          }
        }
        DynamicIslandExpandedRegion(.trailing) {
          VStack(alignment: .trailing, spacing: 4) {
            Text(statusText)
              .font(.caption2)
              .foregroundColor(.gray)
            Text(timerInterval: startDate...Date.distantFuture, countsDown: false)
              .font(.headline)
              .bold()
              .foregroundColor(.green)
              .monospacedDigit()
          }
        }
        DynamicIslandExpandedRegion(.bottom) {
          Text(jobName)
            .font(.caption)
            .foregroundColor(.white.opacity(0.9))
            .lineLimit(1)
            .frame(maxWidth: .infinity, alignment: .center)
        }
      } compactLeading: {
        Text(jobName)
          .font(.caption2)
          .foregroundColor(.white)
          .lineLimit(1)
          .minimumScaleFactor(0.7)
      } compactTrailing: {
        Text(timerInterval: startDate...Date.distantFuture, countsDown: false)
          .font(.caption2)
          .foregroundColor(.green)
          .monospacedDigit()
      } minimal: {
        Image(systemName: "timer")
          .foregroundColor(.green)
      }
    }
  }
}
