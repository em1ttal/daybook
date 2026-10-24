# 0016 · App icons: several, chosen by each user
*2026-10-24 · accepted*

- **Context:** five icon designs looked good, and picking just one felt arbitrary.
- **Options:** ship one icon; ship several and let each person choose in Settings.
- **Choice:** ship several. One folder per icon in `brand/icons/<id>/` (light + dark masters), discovered automatically like locale folders. Display names are translated. The choice is saved per device, like the theme.
- **Why:** every platform supports it: the web swaps the favicon `<link>`, iOS has alternate app icons, macOS can change the Dock icon. The folder pattern keeps adding an icon a no-code change. Saving per device avoids iOS's "icon changed" alert firing on one device because of a change made on another. Cost: each new icon needs a dark version and a 16 px check. Details: [design/icon.md](../design/icon.md).
