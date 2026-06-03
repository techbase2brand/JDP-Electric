import WidgetKit
import SwiftUI
import ActivityKit

// Kept in sync with TimerWidgetExtensionLiveActivity for main-target builds.
struct TimerLiveActivity: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: TimerAttributes.self) { context in
      let startDate = Date().addingTimeInterval(-Double(context.state.elapsedTime))
      let jobName = context.attributes.taskName

      VStack(alignment: .leading, spacing: 8) {
        Text(jobName)
          .font(.headline)
          .foregroundColor(.white)
          .lineLimit(2)
        Text(timerInterval: startDate...Date.distantFuture, countsDown: false)
          .font(.title2.bold())
          .foregroundColor(.green)
          .monospacedDigit()
      }
      .padding()
      .activityBackgroundTint(Color.black)

    } dynamicIsland: { context in
      let startDate = Date().addingTimeInterval(-Double(context.state.elapsedTime))
      let jobName = context.attributes.taskName

      return DynamicIsland {
        DynamicIslandExpandedRegion(.leading) {
          Text(jobName)
            .font(.subheadline.bold())
            .lineLimit(2)
        }
        DynamicIslandExpandedRegion(.trailing) {
          Text(timerInterval: startDate...Date.distantFuture, countsDown: false)
            .monospacedDigit()
            .foregroundColor(.green)
        }
      } compactLeading: {
        Image(systemName: "timer")
          .foregroundColor(.green)
      } compactTrailing: {
        Text(timerInterval: startDate...Date.distantFuture, countsDown: false)
          .font(.caption.bold())
          .monospacedDigit()
          .foregroundColor(.green)
      } minimal: {
        Image(systemName: "timer")
          .foregroundColor(.green)
      }
    }
  }
}
