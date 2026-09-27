---
name: Sufyan Farooq Portfolio
description: An editorial portfolio for practical technology and human outcomes.
colors:
  paper: "#eef4fa"
  paper-light: "#f8faff"
  paper-dark: "#e2eaf5"
  ink: "#101f33"
  ink-soft: "#334761"
  muted: "#53647b"
  line: "#bdc9da"
  accent: "#1567d8"
  accent-dark: "#0c4f9f"
  slate-blue: "#526f8b"
  night: "#101d2a"
  status-blue: "#4b7fb0"
  status-green: "#658350"
  button-text: "#fffaf1"
typography:
  display:
    fontFamily: "Pliant, Bricolage Grotesque, Manrope, sans-serif"
    fontSize: "clamp(3.3rem, 6.3vw, 6.125rem)"
    fontWeight: 700
    lineHeight: 0.91
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "DM Mono, monospace"
    fontSize: "0.72rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.065em"
rounded:
  xs: "2px"
  sm: "3px"
  md: "4px"
  button: "5px"
  hero-button: "10px"
  logo: "10px"
spacing:
  nav-gutter: "28px"
  mobile-gutter: "22px"
  section-mobile: "76px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.button-text}"
    typography: "700 0.72rem Manrope, sans-serif"
    rounded: "{rounded.button}"
    padding: "0 19px"
    height: "48px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "700 0.72rem Manrope, sans-serif"
    rounded: "{rounded.button}"
    padding: "0 19px"
    height: "48px"
  input:
    backgroundColor: "{colors.paper-light}"
    textColor: "{colors.ink}"
    typography: "400 0.72rem Manrope, sans-serif"
    rounded: "{rounded.sm}"
    padding: "10px 12px"
    height: "46px"
  project-media:
    backgroundColor: "{colors.paper-dark}"
    textColor: "{colors.ink}"
    rounded: "0px"
    size: "aspect-ratio 1.65"
---

# Design System: Sufyan Farooq Portfolio

## Overview

**Creative North Star: "Editorial Field Notes"**

The portfolio reads like a considered field journal about useful technology: clear section numbering, monospaced annotations, fine rules, and confident typography organize the story. Cool paper surfaces and deep navy ink keep the page calm and legible, while blue marks the key actions, links, and ideas that deserve emphasis. The portrait and project interfaces remain the authentic evidence at the center of the experience.

The visual system pairs editorial structure with practical clarity. Its spacing gives each project and career detail room to be read, while repeated labels and hairlines make a long single-page portfolio easy to scan. Blue and navy carry the chosen identity; the slate-blue secondary tone softens supporting details.

**Key Characteristics:**
- Cool blue paper, deep navy ink, and a decisive blue accent.
- Numbered field-note labels set in DM Mono.
- Large, compact display headlines paired with readable Manrope body copy.
- Fine rules and restrained corner rounding keep the work in focus.

## Colors

The palette moves from icy blue paper through layered blue-gray neutrals to a confident cobalt accent and midnight navy.

### Primary
- **Clear Portfolio Blue** (`{colors.accent}`): Primary actions, emphasized words, section markers, links, and focus indicators.
- **Deep Action Blue** (`{colors.accent-dark}`): Hover states and high-contrast text links.

### Secondary
- **Slate Field Blue** (`{colors.slate-blue}`): Supporting location and status details.
- **Status Blue** (`{colors.status-blue}`): Small availability and location markers.
- **Status Green** (`{colors.status-green}`): Live project status only.

### Neutral
- **Icy Paper** (`{colors.paper}`): Main page canvas.
- **Pale Paper** (`{colors.paper-light}`): Alternate section and form surface.
- **Blue Gray Paper** (`{colors.paper-dark}`): Recessed sections and selected command-palette rows.
- **Midnight Navy** (`{colors.night}`): Dark feature section, portrait caption, and footer.
- **Deep Ink** (`{colors.ink}`): Primary text and structural rules.
- **Soft Ink** (`{colors.ink-soft}`): Supporting paragraphs and secondary navigation.
- **Muted Blue Gray** (`{colors.muted}`): Metadata, labels, and tertiary copy.
- **Cool Divider** (`{colors.line}`): Hairlines, field borders, and outlined controls.
- **Warm White** (`{colors.button-text}`): Text on the blue primary action.

**The Blue Signal Rule.** Reserve the strongest blue for actions, focus, active emphasis, and small editorial signals; let the pale paper and navy ink do most of the work.

## Typography

**Display Font:** Pliant (with Bricolage Grotesque, Manrope, and sans-serif fallbacks)
**Body Font:** Manrope (with sans-serif fallback)
**Label/Mono Font:** DM Mono (with monospace fallback)

**Character:** Pliant supplies the dense, confident headline voice. Manrope keeps paragraphs, navigation, and controls direct and approachable; DM Mono gives dates, indices, and small metadata a field-note quality.

### Hierarchy
- **Display** (700, `clamp(3.3rem, 6.3vw, 6.125rem)`, line-height 0.91, letter-spacing -0.025em): The opening statement; it scales down separately on narrow screens.
- **Headline** (700, fluid section scale, line-height 1.01–1.05): Section titles and project names.
- **Title** (600–700, approximately 1.08–1.55rem): Cards, timeline roles, and supporting section headings.
- **Body** (400, 16px, line-height 1.65 at the root): Descriptions and narrative; secondary copy commonly uses 0.72rem with a generous 1.7–1.8 line height.
- **Label** (500, 0.72rem, line-height 1.4, letter-spacing 0.065em, uppercase where used): Indices, dates, categories, and technical metadata.

**The Three Voices Rule.** Use the display face for hierarchy, Manrope for reading and interaction, and DM Mono for annotation; do not use the mono face for paragraph copy.

## Layout

The desktop canvas is capped at 1424px with generous side gutters. The opening combines a broad text column, a portrait column, and a narrow annotation rail; projects use a two-column grid, while later sections shift between split editorial grids and full-width ruled lists. At 980px the hero and several content grids simplify; at 720px the navigation becomes a drawer, the hero and project grid stack, and split content becomes one column. The page uses fine horizontal rules and section padding rather than boxed panels to establish rhythm. On mobile, the main gutter is 22px and section padding is 76px.

## Elevation & Depth

Depth comes mainly from tonal surface changes, authentic project screenshots, and image cropping. Most content remains flat and is separated with hairlines. The command palette is the exception: it uses a clear shadow to float above the page. Interactive cards may use motion, but shadows are not a general-purpose surface treatment.

### Shadow Vocabulary
- **Command palette** (`0 16px 32px -14px rgba(0,0,0,.45)`): Separates the modal search surface from the dimmed page.

## Shapes

The shape language is mostly square and precise: most tags and fields use 2–4px corners, standard buttons use 5px, and the larger hero actions and supplied logo use 10px. Project media uses rectangular frames with clipped imagery. Thin borders and straight rules provide structure more often than rounded containers.

## Components

### Buttons
- **Shape:** Compact, lightly rounded controls (5px); hero actions use 10px corners.
- **Primary:** Cobalt fill, warm-white text, 48px minimum height, and 19px horizontal padding. Hero actions expand to 52px height and 28px horizontal padding.
- **Hover / Focus:** The primary darkens and lifts by 2px. The secondary fills with ink on hover. Keyboard focus uses a 3px accent outline with a 4px offset.
- **Secondary:** Transparent surface with an ink border and ink text.

### Chips
- **Style:** Language tags and project labels use transparent or paper surfaces, thin cool dividers, muted ink, and small 2–3px corners. Technical metadata uses DM Mono.

### Cards / Containers
- **Corner Style:** Project media is square-cornered and clipped; content below stays open rather than in a raised card.
- **Background:** Screens retain their authentic interface colors; empty media falls back to blue-gray paper.
- **Shadow Strategy:** Flat by default; see Elevation & Depth for the command palette exception.
- **Border:** Hairlines separate metadata and supporting content.
- **Internal Padding:** Project copy sits outside the media frame with a top divider above its final metadata row.

### Inputs / Fields
- **Style:** Pale paper fill, 1px border, 3px radius, and 46px minimum height.
- **Focus:** Accent border and a subtle two-pixel blue focus halo.

### Navigation
- **Style:** Sticky pale-paper bar with a bottom hairline, display-face name, mono role label, and compact Manrope links. The mobile layout replaces desktop links with a full-height paper drawer below the header.

### Project Media
Authentic project screenshots are the lead portfolio artifacts. Keep their interface content intact, crop only within the media frame, and retain clear titles, short descriptions, and small index metadata nearby.

## Do's and Don'ts

### Do:
- **Do** use the paper, ink, and accent tokens for page surfaces, text, and actions.
- **Do** use fine rules and mono annotations to support scanning across the long portfolio.
- **Do** keep the supplied portrait and project interfaces photographic and recognizable.
- **Do** preserve visible keyboard focus and the reduced-motion accommodation.

### Don't:
- **Don't** introduce unrelated accent colors into the portfolio chrome.
- **Don't** place project screenshots inside generic elevated cards; let the artifact lead.
- **Don't** use rounded pill shapes as the default form for controls or metadata.
