# Step 3 · iOS app
*Status: planned*

**Goal:** a SwiftUI iPhone app on the same API, in `apple/` (one Xcode project with an iOS target now and a macOS target in step 4).

## Planned milestones
- Xcode project in `apple/`, with a generated API client (`swift-openapi-generator` from `server/api/openapi.yaml`).
- Bearer-token login (same `sessions` table, `kind = 'bearer'`), token stored in the Keychain.
- Today, lists and task editing; a calendar view.
- Strings from `locales/` converted into a String Catalog; app icon from `brand/`.
- Tests: unit tests for view models, UI tests for the critical flows.
- Notifications for reminders (the `reminders` table from the data model's "later" list).

## What I'll learn
Swift and SwiftUI, generated API clients, the Keychain, App Store tooling (signing, TestFlight).

## Security checkpoint
[security/native-apps.md](../../security/native-apps.md).
