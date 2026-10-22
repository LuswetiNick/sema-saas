---
name: sema-landing-preview
source: approved-spec-0001
character: "Dark, cinematic, and precise. Quiet emerald light, warm ivory type, and layered glass make the support flow feel tangible."
tokens: "landing.css owns the scoped tokens. The approved build contract is docs/specs/web/0001-sema-landing/index.md."
---

## Build mandate

You can keep the complete visual sequence from the approved reference, including the raised flow cards and the long scroll composition. This is a deliberately fictional design preview, not evidence that Sema is live.

## Character and direction

You can balance large, light sans headings with an italic serif accent and small mono labels. Procedural rings and original vector scenes replace the missing media, rather than leaving empty image boxes.

## Composition patterns

The page moves from the hero flow through sample organizations, platform cards, process steps, a reveal sentence, sample metrics, and a final panel to the full footer. You can keep strong hierarchy and generous section rhythm without adding unrelated sections.

## Component and usage rules

You can keep the visual treatment local to this feature. Shared button variants provide native anchor styling; semantic colors are mapped locally. Decorative diagrams are not interactive controls. You can label planned links as text, not dead anchors.

## Responsive and accessibility direction

You can preserve the supplied breakpoints and contain visual bleed locally. Reduced motion and the pause control expose a complete reading layout. You can keep all sample labels readable, provide visible focus, and verify contrast against the rendered surfaces.

## Stylesheet compatibility

You approved uniquely prefixed feature CSS during implementation. The existing Turbopack loader does not preserve CSS Module exports, so `landing.css` uses the `sema-` class namespace without changing the shared loader.
