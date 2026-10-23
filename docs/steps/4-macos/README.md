# Step 4 · macOS app
*Status: planned*

**Goal:** a Mac app from the same SwiftUI codebase as step 3: a macOS target in the `apple/` Xcode project, with Mac-specific touches (menu bar, keyboard shortcuts, multiple windows).

## Planned milestones
- macOS target sharing the step 3 code; platform differences kept in small `#if os(macOS)` sections.
- Menu bar quick-add, keyboard shortcuts, a sidebar layout.
- macOS app icon (its own rounded-square shape, see [design/icon.md](../../design/icon.md)).
- Distribution: notarised build outside the App Store, or the Mac App Store.

## What I'll learn
Sharing SwiftUI code across platforms, macOS app conventions, code signing and notarisation.

## Security checkpoint
[security/native-apps.md](../../security/native-apps.md) (macOS section).
