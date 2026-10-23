// Prints WCAG 2.x contrast ratios for the colour pairings used in docs/design/style-guide.md.
// Usage: node scripts/check-contrast.mjs
// AA thresholds: 4.5 for body text, 3.0 for large text (≥24px, or ≥18.66px bold) and UI parts.

const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

// [foreground, background, what it's used for, minimum ratio required]
const pairs = [
  // Light theme
  ['#1F2A1C', '#F4F6E8', 'light: body text on page', 4.5],
  ['#1F2A1C', '#FBFCF5', 'light: body text on card', 4.5],
  ['#55604F', '#F4F6E8', 'light: muted text on page', 4.5],
  ['#55604F', '#FBFCF5', 'light: muted text on card', 4.5],
  ['#476A3C', '#F4F6E8', 'light: link / accent text on page', 4.5],
  ['#476A3C', '#FBFCF5', 'light: link / accent text on card', 4.5],
  ['#5F8651', '#F4F6E8', 'light: Fern fill / focus ring / large text', 3],
  ['#FFFFFF', '#476A3C', 'light: button label on primary button', 4.5],
  ['#FFFFFF', '#3B5932', 'light: button label on primary button (hover)', 4.5],
  ['#B42318', '#FBFCF5', 'light: danger text', 4.5],
  ['#8A5A00', '#FBFCF5', 'light: warning text', 4.5],
  ['#1F2A1C', '#DCE7D3', 'light: text on Fern-tint chip / calendar event', 4.5],
  ['#5F8651', '#FBFCF5', 'light: Fern border / icon on card', 3],
  // Dark theme
  ['#E5E6FA', '#4A4946', 'dark: Lavender text on page', 4.5],
  ['#FAFAFF', '#6F6E6A', 'dark: body text on card (Dim Grey)', 4.5],
  ['#E5E6FA', '#6F6E6A', 'dark: Lavender large text / icons on card', 3],
  ['#D2D3E8', '#4A4946', 'dark: muted text on page', 4.5],
  ['#FAFAFF', '#5A5955', 'dark: text on raised/hover surface', 4.5],
  ['#2E2D3A', '#C9CBEF', 'dark: text on Lavender-tint chip / calendar event', 4.5],
  ['#2E2D3A', '#E5E6FA', 'dark: button label on Lavender button', 4.5],
  ['#2E2D3A', '#F2F2FD', 'dark: button label on Lavender button (hover)', 4.5],
  ['#E5E6FA', '#4A4946', 'dark: focus ring on page', 3],
  ['#FFC2B8', '#4A4946', 'dark: danger text on page', 4.5],
  ['#F3D58F', '#4A4946', 'dark: warning text on page', 4.5],
]

let failed = 0
for (const [fg, bg, label, min] of pairs) {
  const ratio = contrast(fg, bg)
  const ok = ratio >= min
  if (!ok) failed++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${ratio.toFixed(2).padStart(5)}:1  (min ${min})  ${fg} on ${bg}  ${label}`)
}
process.exitCode = failed ? 1 : 0
