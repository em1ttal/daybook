# Native app security (iOS and macOS)

*Applies in steps 3–4.*

- [ ] Bearer token stored in the **Keychain**, never in `UserDefaults` or files.
- [ ] App Transport Security on: HTTPS only, no exceptions.
- [ ] **No secrets in the app bundle.** Anyone can unpack an app, so API keys or signing secrets inside it are public.
- [ ] Lost device: the session shows up in Settings → Sessions on the web and can be revoked, which kills the token server-side.
- [ ] Sign out clears the Keychain item and cached data.
- [ ] Hide sensitive content in the app switcher snapshot (optional, iOS).
- [ ] macOS: hardened runtime, App Sandbox entitlements kept minimal, notarised builds.
- [ ] Backend re-check: bearer tokens get the same expiry, revocation and rate limits as cookies.
