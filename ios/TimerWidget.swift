import WidgetKit
import SwiftUI
import ActivityKit

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
          .font(.title2)
          .bold()
          .foregroundColor(.green)
          .monospacedDigit()
      }
      .frame(maxWidth: .infinity, alignment: .leading)
      .padding()
      .activityBackgroundTint(Color.black)
      .activitySystemActionForegroundColor(.green)

    } dynamicIsland: { context in
      let startDate = Date().addingTimeInterval(-Double(context.state.elapsedTime))
      let jobName = context.attributes.taskName

      return DynamicIsland {
        DynamicIslandExpandedRegion(.leading) {
          Text(jobName)
            .font(.subheadline)
            .bold()
            .foregroundColor(.white)
            .lineLimit(2)
        }
        DynamicIslandExpandedRegion(.trailing) {
          Text(timerInterval: startDate...Date.distantFuture, countsDown: false)
            .font(.headline)
            .foregroundColor(.green)
            .monospacedDigit()
        }
      } compactLeading: {
        Text(jobName)
          .font(.caption2)
          .lineLimit(1)
      } compactTrailing: {
        Text(timerInterval: startDate...Date.distantFuture, countsDown: false)
          .font(.caption2)
          .monospacedDigit()
      } minimal: {
        Image(systemName: "timer")
      }
    }
  }
}
