# Dating App - Style Guide

This style guide outlines the visual design and user interface standards for the Dating App, aiming for a modern, Gen Z-friendly aesthetic. It is based on the `genz_ui_ux_research_summary.txt` and general web design best practices.

## 1. Color Palette (Dark Theme Focus)

We will prioritize a dark theme for its popularity among the target audience. A light theme can be developed later.

*   **Background (Dark Theme):**
    *   Primary: `#121212` (Very Dark Grey - almost black)
    *   Secondary (e.g., for cards or distinct sections): `#1A1A1A` (Dark Grey)
*   **Primary Text:**
    *   Main: `#E0E0E0` (Light Grey/Off-White)
    *   Secondary/Subdued: `#A0A0A0` (Medium Grey)
*   **Primary Accent:**
    *   `#00F5D4` (Bright Teal) - Use for CTAs, active states, important highlights.
*   **Secondary Accent/Subtle Elements:**
    *   `#00BFA5` (Slightly darker/muted Teal) - For less prominent interactive elements or borders.
    *   Alternatively, for subtle borders or dividers on dark backgrounds: `#333333` (Cool Grey).
*   **Success/Notification:**
    *   `#4CAF50` (Standard Green)
    *   Text on Success: `#FFFFFF`
*   **Error/Notification:**
    *   `#F44336` (Standard Red)
    *   Text on Error: `#FFFFFF`

**Accessibility Note:** Ensure sufficient contrast ratios are met, especially for text against backgrounds, using tools like WebAIM's Contrast Checker.

## 2. Typography

Clean, modern, and readable fonts are crucial.

*   **Font Family:**
    *   **Headings:** "Poppins", sans-serif
    *   **Body & UI Elements:** "Open Sans", sans-serif
    *   **Google Fonts Import (add to `style.css`):**
        ```css
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&family=Poppins:wght@500;600;700;800&display=swap');
        ```
        *Usage in CSS:*
        ```css
        body { font-family: 'Open Sans', sans-serif; }
        h1, h2, h3, h4, h5, h6 { font-family: 'Poppins', sans-serif; }
        ```

*   **Base Font Size:**
    *   Body: `16px` (1rem)
*   **Font Weights:**
    *   Body Regular: `400`
    *   Body SemiBold (for emphasis, labels): `600`
    *   Headings: `600` or `700` (Poppins offers various weights)
    *   Buttons: `600`
*   **Heading Sizes (Responsive - consider using `rem` or `em` for scalability):**
    *   `h1`: `2.5rem` (40px at 16px base) - `font-weight: 700;`
    *   `h2`: `2rem` (32px) - `font-weight: 700;`
    *   `h3`: `1.75rem` (28px) - `font-weight: 600;`
    *   `h4`: `1.25rem` (20px) - `font-weight: 600;`
*   **Line Height:**
    *   Body Text: `1.6`
    *   Headings: `1.3`

## 3. Layout & Spacing

A clean, uncluttered interface with consistent spacing.

*   **General Principle:** Generous whitespace. Focus on content hierarchy.
*   **Responsive Design:** Mobile-first approach. Ensure layouts adapt gracefully to all screen sizes.
*   **Grid/Flexbox:** Strongly encourage the use of CSS Flexbox and Grid for structuring layouts.
*   **Card Design:**
    *   Use for user listings, profile summaries, match suggestions, etc.
    *   Background: `Secondary Background` color (e.g., `#1A1A1A`).
    *   Border: Subtle border, e.g., `1px solid #333333` (Secondary Accent/Subtle).
    *   Rounded Corners: `8px` to `12px` (e.g., `border-radius: 10px;`).
    *   Shadow (optional, use subtly on dark themes): `box-shadow: 0 4px 15px rgba(0, 245, 212, 0.1);` (using Primary Accent color with low opacity).
*   **Standard Spacing Unit:**
    *   Base: `8px` (or `0.5rem` if `1rem = 16px`).
    *   Consistent Multiples:
        *   `xs: 4px` (`0.25rem`)
        *   `sm: 8px` (`0.5rem`)
        *   `md: 16px` (`1rem`)
        *   `lg: 24px` (`1.5rem`)
        *   `xl: 32px` (`2rem`)
    *   Apply these for margins, paddings, and gaps between elements.

## 4. Interactivity & UI Elements

*   **Buttons:**
    *   Primary CTA: Solid background (Primary Accent `#00F5D4`), text color `#121212` (or white if contrast is better), `padding: 10px 20px`, `border-radius: 8px`, `font-weight: 600`.
    *   Secondary: Outline button (border color Primary Accent, text color Primary Accent) or subtle background.
*   **Input Fields:**
    *   Background: `#333333` or a slightly lighter shade than card background.
    *   Border: `1px solid #555555`.
    *   Text Color: Primary Text (`#E0E0E0`).
    *   `padding: 10px`, `border-radius: 8px`.
*   **Hover Effects:**
    *   Subtle transitions on interactive elements (buttons, links, cards).
    *   Example: `transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out;`
    *   Buttons might slightly lighten/darken or scale up. Cards might lift slightly (using box-shadow or transform).
*   **Focus States:**
    *   Clear visual indicators for keyboard navigation and accessibility.
    *   Example: A distinct outline (e.g., `2px solid PrimaryAccentColor`) or a box-shadow.
    *   Ensure default browser focus rings are not suppressed without providing a better alternative.
*   **Navigation:**
    *   Clear and intuitive. For mobile, a bottom navigation bar is common for primary sections.
    *   Active links should be clearly indicated (e.g., using Primary Accent color or a stronger font weight).

## 5. Imagery & Icons (Future Consideration)

*   **Profile Pictures:** Prominent, likely circular or soft rounded squares.
*   **Icons:** Use a consistent icon set (e.g., Feather Icons, Material Icons, or FontAwesome). SVGs are preferred for scalability and sharpness. Icons should match the overall minimalist and modern aesthetic.

This style guide is a living document and may be updated as the project evolves.
