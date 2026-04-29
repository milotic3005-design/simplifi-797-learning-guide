## 2024-05-24 - Interactive Element Focus Styles
**Learning:** Found multiple button styles (`.btn-primary`, `.btn-ghost`, `.tab`) that are missing `focus-visible` styles for keyboard navigation accessibility. Keyboard accessibility relies on users being able to visually locate the active element.
**Action:** Add a unified `:focus-visible` state across all button/tab classes in index.css so keyboard users have clear visual feedback without compromising mouse users' experience.
