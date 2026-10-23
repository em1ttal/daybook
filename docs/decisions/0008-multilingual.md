# 0008 · Multilingual from the start
*2026-10-23 · accepted*

- **Context:** the old UI is hard-coded in Spanish, the portfolio audience is international, and I want daybook to support more languages later.
- **Options:** hard-code English now and add i18n "later", or plan for it from the start.
- **Choice:** from the start. Every user-facing string lives in a per-language JSON file (`web/src/locales/en.json`, `es.json`) and is looked up by key with `vue-i18n`. English is the source language. The API returns stable error *codes* instead of sentences, so each client translates them. Docs are written in English, with translations as separate files (`README.es.md`, `docs/es/…`).
- **Why:** pulling strings out of hundreds of components afterwards is slow and easy to get wrong. Doing it as each component is touched costs almost nothing. Keeping the API language-neutral means the iOS/macOS apps can use their own string catalogs without any server changes.
