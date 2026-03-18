//
//  TimerWidgetExtensionBundle.swift
//  TimerWidgetExtension
//
//  Created by Rahul   on 18/03/26.
//

import WidgetKit
import SwiftUI

@main
struct TimerWidgetExtensionBundle: WidgetBundle {
    var body: some Widget {
        TimerWidgetExtension()
        TimerWidgetExtensionControl()
        TimerWidgetExtensionLiveActivity()
    }
}
