# Design System Document



## 1. Overview & Creative North Star: "The Digital Curator"

This design system moves beyond the generic "SaaS template" to embrace a high-end editorial aesthetic. Our North Star is **The Digital Curator**: a philosophy that treats every social media post as a piece of art in a modern gallery.



Instead of a cluttered interface, we use hyper-minimalism, extreme white space, and a high-contrast monochrome palette to create an atmosphere of authority and precision. We break the rigid grid through intentional asymmetry—placing elements off-center to guide the eye—and using typographic scale as the primary driver of hierarchy. This is not just a landing page; it is a sophisticated workspace for digital expression.



## 2. Colors & Tonal Depth

The palette is strictly monochrome, but "monochrome" does not mean "flat." We use depth through tonal shifts rather than lines.



### The "No-Line" Rule

**Explicit Instruction:** Do not use `1px` solid borders (like `#E5E7EB`) to section off large areas of the layout. Boundaries must be defined by shifts in background color. For example, a feature section should transition from `surface` (#f9f9f9) to `surface_container_low` (#f3f3f4).



### Surface Hierarchy & Nesting

Treat the UI as a series of stacked, fine paper sheets.

* **Base Layer:** `surface` (#f9f9f9).

* **Secondary Content:** `surface_container` (#eeeeee).

* **Interactive/Elevated Elements:** `surface_container_lowest` (#ffffff) to provide a "pop" against the off-white base.



### The Glass & Gradient Rule

To add "soul" to the minimalism, use **Glassmorphism** for navigation bars or floating action menus. Use `surface` at 80% opacity with a `20px` backdrop-blur.

* **Signature Texture:** For primary CTAs, do not use a flat black. Use a subtle linear gradient from `primary` (#000000) to `primary_container` (#3b3b3b) at a 45-degree angle to provide a premium, satin-like finish.



## 3. Typography: The Editorial Voice

Typography is the "hero" of this system. We pair the geometric authority of **Manrope** for headlines with the functional precision of **Inter** for UI elements.



* **Display & Headlines (Manrope):** Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for hero statements. This creates a "poster" effect that demands attention.

* **Body & Labels (Inter):** Use `body-md` (0.875rem) for descriptions. The high x-height of Inter ensures readability even when nested within complex components.

* **Hierarchy:** Use a massive contrast between `display-lg` and `label-md`. This "extreme scale" is what separates a high-end editorial look from a standard website.



## 4. Elevation & Depth

In a flat modern layout, depth must be whispered, not shouted.



* **The Layering Principle:** Place a `surface_container_lowest` card (Pure White) on a `surface_dim` (#dadada) background. The contrast alone creates the "lift."

* **Ambient Shadows:** If a shadow is required for a floating state (e.g., a rotating social card), use: `box-shadow: 0 20px 40px rgba(26, 28, 28, 0.04)`. The shadow color is a tinted version of `on_surface`, making it feel like natural light.

* **The Ghost Border Fallback:** If a container needs a boundary for accessibility, use `outline_variant` (#c6c6c6) at 20% opacity. **Never use 100% opaque borders.**

* **Refractive Depth:** Use backdrop-blur on `surface_variant` overlays to create a frosted-glass effect for modals, ensuring the user never feels "blocked" from the content behind.



## 5. Components



### Buttons

* **Primary:** `primary` background, `on_primary` text. Flat, no border. Use `rounded-md` (0.375rem). On hover, transition to `primary_fixed` (#5e5e5e).

* **Secondary:** `surface_container_highest` background. No border. This creates a "ghost" effect that feels integrated into the page.

* **Tertiary:** Text-only using `label-md`, bolded, with a 2px underline using `outline_variant`.



### Cards & Lists (The Rotation Feed)

* **Rule:** Forbid divider lines.

* **Implementation:** Use the spacing scale `8` (2.75rem) to separate list items. Use a subtle background shift (`surface_container_low`) on hover to indicate interactivity.



### Social Media Chips

* Used for platform filtering (Twitter, Instagram, etc.).

* **Style:** `surface_container_high` background, `on_surface` text. Shape: `full` (pill-shaped). When active, switch to `primary` (#000000).



### Custom Component: The "Rotator Track"

Since this is a Social Media Rotator, use a horizontal marquee-style track.

* **Styling:** Elements should have `none` roundedness (sharp edges) to lean into the "Modern Brutalist" side of the aesthetic. Use `surface_container_lowest` for the card background to make the social content "glow" against the `surface` background.



## 6. Do's and Don'ts



### Do:

* **Embrace Asymmetry:** Align your hero text to the left, but place your primary CTA on a slightly offset grid line to create visual tension.

* **Use Generous Leading:** Set your line-height for `body-lg` to 1.6 to ensure the monochrome text feels airy and premium.

* **Tonal Logic:** Always ensure the "inner" container is lighter than the "outer" container to mimic how light hits physical objects.



### Don't:

* **Don't use #000000 for everything:** Use `on_surface_variant` (#474747) for secondary text to reduce eye strain.

* **Don't use 1px dividers:** If you feel the need for a line, use a `4px` wide gap (spacing scale `1`) of the background color instead.

* **Don't over-radiate:** Stick to `md` (0.375rem) or `none`. Overly rounded corners (like `xl`) will break the "ultra-clean" editorial feel and make it look like a mobile app.