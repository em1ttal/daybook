# 0014 · Docs: many short files, by topic and by step
*2026-10-23 · accepted*

- **Context:** one `LEARNING.md` was going to grow past a thousand lines over four steps.
- **Options:** one long file with an index; a folder tree of short files.
- **Choice:** `docs/` split by topic (product, architecture, design, security, decisions, concepts) and by step (`steps/<n>/`, one chapter per milestone). One decision per file. `docs/README.md` is the entry point.
- **Why:** short files are easier to read in one sitting, to link to, and to translate one at a time. The decision log stays append-only because each record is its own file.
