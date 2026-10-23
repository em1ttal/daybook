# App icon

*Concept: to be chosen (A · Today page, B · Bookmark d, C · Open daybook).*

One master drawing in `brand/`, exported to every size each platform needs. Light and dark versions use the [style guide](style-guide.md) palette: Fern Deep on Ivory, Lavender on Dim Grey Deep.

## Files
| File | Used for |
|---|---|
| `brand/icon.svg` | Master, light version (the one browsers and stores show) |
| `brand/icon-dark.svg` | Dark version (iOS 18+ dark icons, dark favicon via `prefers-color-scheme`) |
| `brand/icon-mono.svg` | One-colour version for Safari pinned tabs and tinted iOS icons |

`scripts/gen-icons.mjs` renders them into the sizes below. Run it after changing a master. It uses two dev dependencies: **sharp** (renders SVG to PNG) and **png-to-ico** (packs the `.ico`).

## Sizes per platform

| Platform | Output | Notes |
|---|---|---|
| Web (step 1) | `web/public/favicon.svg` | Modern browsers use the SVG directly, at any size |
| | `web/public/favicon.ico` (32 + 48 px) | Fallback for older browsers and tools that only look for `.ico` |
| | `web/public/apple-touch-icon.png` (180 px) | "Add to Home Screen" on iPhone. No transparency. |
| | `web/public/icon-192.png`, `icon-512.png` | For a web app manifest later |
| iOS (step 3) | 1024 px PNG in `apple/` asset catalog | Full square, **no transparency, no rounded corners**: iOS applies its own mask. Xcode generates the smaller sizes. |
| macOS (step 4) | 1024 px PNG, macOS shape | macOS doesn't mask. The icon is drawn as a rounded square on a transparent canvas with padding (Apple's macOS icon grid: about 824 px of artwork on 1024). Needs its own master. |

## Rules
- It must read at **16 px** in a browser tab: bold shapes, no thin lines, no text.
- Colours come from the palette only. If one changes, rerun `node scripts/check-contrast.mjs`.
- The masters are the source of truth. Never edit an exported PNG by hand.
