---
name: Luna's Embrace
colors:
  surface: '#FFFFFF'
  surface-dim: '#ebd4dd'
  surface-bright: '#fff8f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff0f5'
  surface-container: '#ffe8f1'
  surface-container-high: '#f9e2eb'
  surface-container-highest: '#f3dde5'
  on-surface: '#24181e'
  on-surface-variant: '#554246'
  inverse-surface: '#3a2c33'
  inverse-on-surface: '#ffecf3'
  outline: '#887176'
  outline-variant: '#dbc0c5'
  surface-tint: '#a1385e'
  primary: '#a1385e'
  on-primary: '#ffffff'
  primary-container: '#f2789f'
  on-primary-container: '#6c0c36'
  inverse-primary: '#ffb1c6'
  secondary: '#8b4f2e'
  on-secondary: '#ffffff'
  secondary-container: '#fdaf87'
  on-secondary-container: '#784020'
  tertiary: '#655590'
  on-tertiary: '#ffffff'
  tertiary-container: '#a895d6'
  on-tertiary-container: '#3c2c65'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9e1'
  primary-fixed-dim: '#ffb1c6'
  on-primary-fixed: '#3f001b'
  on-primary-fixed-variant: '#822046'
  secondary-fixed: '#ffdbcb'
  secondary-fixed-dim: '#ffb691'
  on-secondary-fixed: '#341100'
  on-secondary-fixed-variant: '#6e3819'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#d0bcff'
  on-tertiary-fixed: '#210f49'
  on-tertiary-fixed-variant: '#4d3d77'
  background: '#FFF6F4'
  on-background: '#24181e'
  surface-variant: '#f3dde5'
  surface-muted: '#FDECEF'
  border: '#F6DFE2'
  text-muted: '#9B8890'
  primary-deep: '#D9578A'
  primary-soft: '#FCE1EA'
  accent-mint: '#8FD4C1'
  accent-butter: '#FFD98E'
  danger: '#E4756A'
  dark-background: '#241A20'
  dark-surface: '#2F2229'
  dark-text: '#F7ECEF'
typography:
  display-lg:
    fontFamily: Baloo 2
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 38px
  headline-md:
    fontFamily: Baloo 2
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  subtitle-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 17px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  caption:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  display-lg-mobile:
    fontFamily: Baloo 2
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  margin-mobile: 20px
  gutter: 16px
---

## Brand & Style

The design system is centered on the concept of an **Empathetic Companion**. It creates a "safe space" for users by prioritizing warmth, patience, and non-judgmental interactions. The brand avoids the cold, clinical aesthetic of traditional medical apps, opting instead for a "cozy" and "squishy" (empuk) feel that balances professional Human Interface standards with illustrative, gamified elements.

The style is a blend of **Soft Minimalism** and **Tactile UI**. It uses generous whitespace, pastel gradients, and high corner radii to evoke a sense of physical comfort. A key differentiator is "Positive-Only" gamification—there are no penalties for missed logs, only rewards for presence. The mascot, Luna, serves as the emotional anchor of the experience, adapting her expressions and accessories based on the user's cycle phase and mood.

**Brand Voice:**
- **Calm & Safe:** Using Indonesian labels that are gentle and supportive (e.g., "Kabar Hari Ini?" instead of "Log Data").
- **Fun & Happy:** Celebrating small wins with soft "bounce" animations and "Luna" stickers.
- **Contextual Empathy:** The UI shifts subtly to match the biological and emotional state of the user.

## Colors

The color system is built on a foundation of warm, low-saturation pastels designed to reduce visual stress. 

- **Primary & Secondary:** The core pink (`#F2789F`) and peach (`#FFB088`) represent the brand's warmth. 
- **Cycle Phase Mapping:** Colors are functionally mapped to cycle phases:
    - **Menstrual:** Primary Pink (Droplet/Full Moon)
    - **Follicular:** Peach (Sprout)
    - **Ovulation:** Lavender (Flower)
    - **Luteal:** Butter (Cloud)
- **Contrast:** While the palette is soft, accessibility is maintained using `primary-deep` for text on light backgrounds.
- **Dark Mode:** In dark mode, the background shifts to a deep, warm purple-brown (`#241A20`) to maintain the "cozy" feeling without the harshness of pure black, with primary colors gaining slight luminosity for better legibility.

## Typography

This design system uses a two-font strategy to balance personality with functional clarity.

- **Baloo 2:** Used for **Display** and **Headlines**. Its rounded, bubbly letterforms reinforce the "squishy" aesthetic and provide a friendly greeting to the user. Use this for large numbers and hero greetings.
- **Plus Jakarta Sans:** Used for all **Functional UI** elements. Its modern, geometric construction ensures high legibility for body text, labels, and captions. 

**Formatting Rules:**
- Use **Sentence case** for all Indonesian labels (e.g., "Simpan perubahan", not "SIMPAN PERUBAHAN").
- Line heights are slightly generous (1.4x - 1.6x) to increase "breathability" and ease of reading during times of physical discomfort.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** model with high internal margins to prevent content from feeling cramped. 

- **Grid:** A 12-column grid is used for desktop, while mobile relies on a single column with a fixed 20px edge margin.
- **Rhythm:** An 8px linear scale (with a 4px half-step for tight components) governs all padding and margins. 
- **Touch Targets:** All interactive elements (buttons, chips, icons) must maintain a minimum touch area of 44x44px, regardless of their visual size.
- **Whitespace:** Emphasize vertical whitespace between sections to allow the mascot and illustrations to "breathe" and stand out as focal points.

## Elevation & Depth

Visual hierarchy is achieved through **Tonal Layering** and **Ambient Tinted Shadows**. 

- **Shadow Character:** Shadows are never neutral grey. They use a soft pink tint (`#F2789F`) at low opacity (10%) with a large blur radius (20px). This creates a "glow" effect rather than a harsh drop shadow, making cards feel like they are floating on a soft cushion.
- **Pressed States:** Instead of deep shadows, interactive elements use a subtle scale-down effect (`scale: 0.98`) to mimic the physical sensation of pressing into something soft.
- **Depth Levels:**
    - **Level 0 (Background):** `#FFF6F4`
    - **Level 1 (Cards/Sheets):** White surface with tinted shadow.
    - **Level 2 (Modals/Popovers):** Higher blur (32px) and slight backdrop blur (8px) for maximum focus.

## Shapes

The shape language is "Extra Rounded" to support the *empuk* design pillar. Sharp corners are strictly avoided as they represent tension.

- **Cards:** 24px corner radius for a container-like feel.
- **Buttons:** 18px corner radius, creating a soft rectangle that isn't quite a pill but feels safe to touch.
- **Bottom Sheets:** Use a large 32px radius on the top two corners to suggest a "tucked-in" comfort.
- **Chips & Pills:** Always use a full radius (999px) for a pebble-like appearance.
- **Strokes:** Use 1px solid lines for logged data and 1.5px dashed lines for predicted/future events.

## Components

### Buttons
- **Primary:** Background `primary`, text White, 18px radius. Use a gentle "bounce" on tap.
- **Secondary:** Background `primary-soft`, text `primary-deep`.
- **Labels:** "Mulai", "Simpan", "Lanjut".

### Cards
- **Style:** 24px radius, tinted pink shadow, 16px-24px internal padding.
- **Usage:** Used for cycle insights, daily tips, and mood summaries.

### Chips & Tabs
- **Style:** Fully rounded (pill). Active state uses `primary-soft` background with `primary-deep` text and a 1.5px border.
- **Usage:** Selection of symptoms (e.g., "Kram", "Sakit Kepala").

### Input Fields
- **Style:** 16px radius, `surface` background, `border` color stroke.
- **Labels:** Indonesian prompts such as "Ceritakan perasaanmu..."

### Mood Stickers
- **Style:** Circular icons featuring Luna with different expressions. These are collectible and should appear "pop-able" with a slight scale-up animation when hovered or selected.

### The Mascot (Luna)
- **Placement:** Positioned in empty states, headers, or floating near specific data cards.
- **Context:** If the user logs "Sedih" (Sad), Luna appears with an empathetic expression offering a cup of tea. If it is the "Ovulation" phase, Luna has sparkly eyes and stars.