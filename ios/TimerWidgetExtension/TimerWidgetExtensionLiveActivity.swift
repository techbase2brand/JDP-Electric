//
//  TimerWidgetExtensionLiveActivity.swift
//  TimerWidgetExtension
//

import ActivityKit
import WidgetKit
import SwiftUI

// MARK: - Theme

private enum TimerLiveTheme {
  static let accent = Color(red: 0.20, green: 0.83, blue: 0.60)
  static let accentSoft = Color(red: 0.20, green: 0.83, blue: 0.60).opacity(0.18)
  static let label = Color.white.opacity(0.62)
  static let title = Color.white
}

// MARK: - Shared views

private struct LiveTimerText: View {
  let startDate: Date
  var font: Font = .system(size: 22, weight: .bold, design: .rounded)

  var body: some View {
    Text(timerInterval: startDate...Date.distantFuture, countsDown: false)
      .font(font)
      .foregroundStyle(TimerLiveTheme.accent)
      .monospacedDigit()
      .lineLimit(1)
      .minimumScaleFactor(0.75)
  }
}

private struct StatusPill: View {
  let isRunning: Bool

  var body: some View {
    HStack(spacing: 5) {
      Circle()
        .fill(isRunning ? TimerLiveTheme.accent : Color.orange)
        .frame(width: 6, height: 6)
      Text(isRunning ? "Running" : "Paused")
        .font(.system(size: 11, weight: .semibold))
        .foregroundStyle(TimerLiveTheme.label)
    }
    .padding(.horizontal, 10)
    .padding(.vertical, 5)
    .background(Capsule().fill(Color.white.opacity(0.14)))
  }
}

private struct AppMark: View {
  var compact: Bool = false

  var body: some View {
    HStack(spacing: compact ? 4 : 6) {
      ZStack {
        Circle()
          .fill(TimerLiveTheme.accentSoft)
          .frame(width: compact ? 22 : 28, height: compact ? 22 : 28)
        Image(systemName: "bolt.fill")
          .font(.system(size: compact ? 10 : 12, weight: .bold))
          .foregroundStyle(TimerLiveTheme.accent)
      }
      if !compact {
        Text("JDP Electric")
          .font(.system(size: 11, weight: .semibold))
          .foregroundStyle(TimerLiveTheme.label)
          .lineLimit(1)
      }
    }
  }
}

private func shortJobName(_ name: String) -> String {
  let trimmed = name.trimmingCharacters(in: .whitespacesAndNewlines)
  guard !trimmed.isEmpty else { return "Job" }
  if trimmed.count <= 5 { return trimmed }
  return String(trimmed.prefix(5)) + "..."
}

/// Album-art style icon (Music-like expanded leading).
private struct TimerArtwork: View {
  var size: CGFloat = 44
  var corner: CGFloat = 8
  var iconSize: CGFloat = 20

  var body: some View {
    ZStack {
      RoundedRectangle(cornerRadius: corner, style: .continuous)
        .fill(TimerLiveTheme.accentSoft)
      Image(systemName: "bolt.fill")
        .font(.system(size: iconSize, weight: .bold))
        .foregroundStyle(TimerLiveTheme.accent)
    }
    .frame(width: size, height: size)
  }
}

/// Right-side compact circle (Apple Music–style detached pill).
private struct CompactTimerCircle: View {
  let startDate: Date
  let isRunning: Bool

  var body: some View {
    ZStack {
      Circle()
        .fill(
          isRunning
            ? Color(red: 0.95, green: 0.45, blue: 0.12).opacity(0.9)
            : Color.orange.opacity(0.85)
        )
      Text(timerInterval: startDate...Date.distantFuture, countsDown: false)
        .font(.system(size: 10, weight: .bold, design: .rounded))
        .foregroundStyle(.white)
        .monospacedDigit()
        .minimumScaleFactor(0.65)
        .lineLimit(1)
        .padding(2)
    }
    .frame(width: 26, height: 26)
  }
}

// MARK: - Widget

struct TimerWidgetExtensionLiveActivity: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: TimerAttributes.self) { context in
      let startDate = Date().addingTimeInterval(-Double(context.state.elapsedTime))
      let jobName = context.attributes.taskName

      // Lock screen card
      VStack(alignment: .leading, spacing: 12) {
        HStack(alignment: .center) {
          AppMark()
          Spacer(minLength: 8)
          StatusPill(isRunning: context.state.isRunning)
        }

        Text(jobName)
          .font(.system(size: 17, weight: .semibold))
          .foregroundStyle(TimerLiveTheme.title)
          .lineLimit(2)
          .fixedSize(horizontal: false, vertical: true)

        LiveTimerText(startDate: startDate, font: .system(size: 34, weight: .bold, design: .rounded))
      }
      .padding(.horizontal, 16)
      .padding(.vertical, 14)
      .activityBackgroundTint(Color(red: 0.08, green: 0.09, blue: 0.11))
      .activitySystemActionForegroundColor(TimerLiveTheme.accent)

    } dynamicIsland: { context in
      let startDate = Date().addingTimeInterval(-Double(context.state.elapsedTime))
      let jobName = context.attributes.taskName
      let isRunning = context.state.isRunning

      return DynamicIsland {
        // Expanded — Apple Music style layout (content: job + timer).
        DynamicIslandExpandedRegion(.leading) {
          TimerArtwork()
        }

        DynamicIslandExpandedRegion(.trailing) {
          Image(systemName: isRunning ? "waveform" : "pause.circle.fill")
            .font(.system(size: 20, weight: .semibold))
            .foregroundStyle(
              isRunning
                ? Color(red: 0.95, green: 0.35, blue: 0.55)
                : TimerLiveTheme.label
            )
            .frame(width: 28, height: 28)
        }

        DynamicIslandExpandedRegion(.center) {
          VStack(alignment: .leading, spacing: 2) {
            Text(jobName)
              .font(.system(size: 15, weight: .bold))
              .foregroundStyle(TimerLiveTheme.title)
              .lineLimit(1)
              .minimumScaleFactor(0.85)
            Text(isRunning ? "JDP Electric · Work Timer" : "JDP Electric · Paused")
              .font(.system(size: 12, weight: .medium))
              .foregroundStyle(TimerLiveTheme.label)
              .lineLimit(1)
          }
          .frame(maxWidth: .infinity, alignment: .leading)
        }

        DynamicIslandExpandedRegion(.bottom) {
          VStack(spacing: 10) {
            HStack(alignment: .center) {
              LiveTimerText(
                startDate: startDate,
                font: .system(size: 13, weight: .semibold, design: .rounded)
              )
              Spacer(minLength: 8)
              Text(isRunning ? "Running" : "Paused")
                .font(.system(size: 13, weight: .medium))
                .foregroundStyle(TimerLiveTheme.label)
                .monospacedDigit()
            }

            HStack {
              Spacer()
              Image(systemName: isRunning ? "pause.fill" : "play.fill")
                .font(.system(size: 28, weight: .bold))
                .foregroundStyle(TimerLiveTheme.title)
              Spacer()
              Image(systemName: "timer")
                .font(.system(size: 18, weight: .semibold))
                .foregroundStyle(TimerLiveTheme.label)
            }
            .padding(.top, 2)
          }
          .padding(.horizontal, 4)
        }

      } compactLeading: {
        HStack(spacing: 6) {
          TimerArtwork(size: 26, corner: 6, iconSize: 13)
          Text(shortJobName(jobName))
            .font(.system(size: 12, weight: .semibold))
            .foregroundStyle(TimerLiveTheme.title)
            .lineLimit(1)
        }
        .fixedSize(horizontal: true, vertical: false)
      } compactTrailing: {
        CompactTimerCircle(startDate: startDate, isRunning: isRunning)
      } minimal: {
        ZStack {
          Circle()
            .fill(TimerLiveTheme.accent.opacity(0.85))
          Image(systemName: "bolt.fill")
            .font(.system(size: 10, weight: .bold))
            .foregroundStyle(.white)
        }
        .frame(width: 22, height: 22)
      }
    }
  }
}
