# platforms
Copy of linktree

---

## CSS/SCSS Guidelines

### Units: `rem` over `px`

**Use `rem` for:**
- Typography (`font-size`)
- Spacing (`padding`, `margin`, `gap`)
- Component dimensions (`width`, `height`)
- Border radius (large values)

**Use `px` for:**
- Thin borders (`1px`, `2px`)
- Box shadows
- Very small values (`< 4px`)

**Conversion:** `1rem = 16px`

```scss
// ✅ Good
font-size: 1.125rem;      // 18px
padding: 1.5rem;          // 24px
width: 11.25rem;          // 180px
gap: 1rem;                // 16px

// ✅ Still fine as px
border: 1px solid;
box-shadow: 0 0 30px rgba(...);
```

**Refactor as we go** - don't batch refactor, update files as we touch them.
