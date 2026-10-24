# App icons

daybook ships **several icons**, and each person picks theirs in Settings ([0016](../decisions/0016-selectable-icons.md)). Concepts: [icon preview page](https://claude.ai/artifact/VUXsHKyi5e2WrQBstnvoME) (private to me).

| Id | Name | Light | Dark |
|---|---|---|---|
| `monogram` | Bookmark d (**default**) | A Fern "d" with a bookmark-notch stem, on Ivory | The same in Lavender, on Dim Grey |
| `page` | Today page | A Fern calendar page with a check, on Ivory | A Lavender page, on Dim Grey |
| `book` | Open daybook | Ivory diary pages with a dark ribbon, on Fern | Lavender pages with a Fern ribbon, on Dim Grey |

The default is set in `brand/icons/config.json` (`{"default": "monogram"}`).

## Folders
Same pattern as [languages](../architecture/i18n.md): one folder per icon, and adding a folder adds a choice.

```
brand/icons/
├── config.json         # which icon is the default
├── monogram/
│   ├── light.svg       # master, 512×512, light version
│   └── dark.svg        # master, dark version
├── page/
└── book/
```

- **The folder name is the id.** It's saved as the user's choice, so it never changes once shipped.
- **The name shown in Settings is translated**, like every other string: `settings.appIcon.<id>` in `locales/<code>/messages.json`.
- Light and dark use the [style guide](style-guide.md) palette: Fern and Ivory for light, Lavender and Dim Grey for dark.

## Generated files
`scripts/gen-icons.mjs` renders every folder: run `npm run icons` after changing or adding an icon, and commit the output. It uses two dev dependencies: **sharp** (renders SVG to PNG) and **png-to-ico** (packs the `.ico`).

| Platform | Output per icon | Notes |
|---|---|---|
| Web (step 1) | `web/public/icons/<id>/favicon.svg` | One SVG holding both versions: an embedded `@media (prefers-color-scheme: dark)` rule switches to the dark one with the browser's theme |
| | `favicon.svg`, `favicon.ico` (32 + 48 px), `apple-touch-icon.png` (180 px) | **Default icon only**, at the root of `web/public/`, linked from `web/index.html`. Browsers, tools and iPhone "Add to Home Screen" read these before any script runs. Changing the default only needs `config.json` + `npm run icons`. |
| iOS (step 3) | 1024 px PNGs in the asset catalog: the default as the app icon, the rest as *alternate icons* | Full square, no transparency, no rounded corners: iOS applies its own mask. iOS 18+ also takes the dark version. |
| macOS (step 4) | 1024 px PNG in the macOS shape | macOS doesn't mask: the artwork is a rounded square with padding (about 824 px on a 1024 canvas). Needs its own export. |

## How switching works
- **Web:** Settings saves the id, and a small function points `<link rel="icon">` at `/icons/<id>/favicon.svg`. Browsers update the tab right away.
- **iOS:** `UIApplication.shared.setAlternateIconName("<id>")`. iOS shows a short "You have changed the icon" alert; that's a system rule.
- **macOS:** `NSApplication.shared.applicationIconImage` changes the Dock icon while the app runs. Finder keeps showing the default.
- **Where the choice is saved: on each device**, like the theme (`localStorage` on the web, `UserDefaults` on Apple). Not in the database: if it synced, a change on the laptop would trigger that iOS alert on the phone out of nowhere. It isn't sensitive, so local storage is fine.

## Rules
- Every icon must read at **16 px**: bold shapes, no thin lines, no text.
- Colours come from the palette only. If one changes, rerun `node scripts/check-contrast.mjs`.
- The masters are the source of truth. Never edit an exported PNG by hand.
- Removing a shipped icon: map its id to the default, so people who picked it don't end up with a broken icon.
