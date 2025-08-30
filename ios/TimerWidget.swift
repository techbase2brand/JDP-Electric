import WidgetKit
import SwiftUI
import ActivityKit

struct TimerLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: TimerAttributes.self) { context in
            let startDate = Date().addingTimeInterval(-Double(context.state.elapsedTime))

            // ✅ Lock Screen UI
            VStack {
                Text("Work Timer")
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
            .activitySystemActionForegroundColor(.green)

        } dynamicIsland: { context in
            let startDate = Date().addingTimeInterval(-Double(context.state.elapsedTime))

            // ✅ Dynamic Island UI
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
