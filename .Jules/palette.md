## 2026-04-27 - ModuleCard Accessibility Learnings
**Learning:** Collapsible sections without aria-expanded and bare checkboxes inside interactive lists can be completely opaque to screen readers in this app's components.
**Action:** Always add aria-expanded to toggle buttons controlling conditionally rendered content, and ensure interactive inputs like checkboxes within lists have descriptive aria-labels referencing their associated content.
