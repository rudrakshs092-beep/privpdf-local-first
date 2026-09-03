# PrivPDF Roadmap

## Done
- Landing page + design foundation
- 10 client-side tools: Merge, Split, Compress, Rotate, Organize, Image→PDF, PDF→Image, Sign, Page Numbers, Text Watermark
- Client-side loading overlay + Download/Share result view on all 10 tools

## In progress — UI/UX redesign (functionality frozen, visuals only)
- [x] Global color system: light blue-gray background, white cards, modern blue accent, navy text; green only for success, red only for error
- [x] Typography: single Inter family
- [x] Header redesign (Tools / How it works / Privacy / FAQ + "Open Tool" CTA, compact mobile)
- [x] Homepage: compact hero with privacy badge, Popular Tools + More PDF Tools, How it works, privacy flow + "want to verify", FAQ, footer
- [x] Unified tool cards ("Use Tool →") and consistent button system
- [x] Tool page shell + upload area redesign (shared, applies to all 10 tools)
- [x] Mobile checks at 320/360/390/430px + regression pass on tools

## Constraints
- 100% client-side, no backend/API/database/login
- Do not rewrite working PDF logic, routes, or download flow
