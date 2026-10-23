# 0013 · User-picked colours are palette keys, not hex
*2026-10-23 · accepted*

- **Context:** lists and labels have a colour the user picks. KanbanIA stored hex strings.
- **Options:** store any hex value; store a key from a fixed palette.
- **Choice:** a key such as `fern`, `sky`, `sand`, `rose`, `plum`, `slate`, `amber` or `lavender`. Each key maps to a light and a dark value in `tokens.css`. The API spec lists them as an enum, and the database has a matching `CHECK`.
- **Why:** a hex picked on a light background can be unreadable in dark mode. With keys, each colour has a tested variant per theme, checked by `scripts/check-contrast.mjs`. Adding a colour is a small migration plus a token.
