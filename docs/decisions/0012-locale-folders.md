# 0012 · Languages: one folder per locale at the repo root
*2026-10-23 · accepted*

- **Context:** I want adding a language to be "add a folder", with a selector that shows each language with a flag. The web, server and Apple apps all need the strings.
- **Options:** folder named by display name (`locales/Español/`) or by language code (`locales/es/`); files inside `web/` or at the repo root.
- **Choice:** `locales/<code>/messages.json` + `flag.svg` at the repo root. The selector's label comes from `meta.name` in the JSON, written in that language.
- **Why:** code needs the language code for `<html lang>`, `Intl` formatting and the saved user setting, and non-ASCII folder names cause tooling trouble. Root placement means the Apple apps reuse the same files in step 3. Flags are a hint only: a flag is a country, not a language. Supersedes the `web/src/locales/` location in [0008](0008-multilingual.md). Details: [i18n](../architecture/i18n.md).
