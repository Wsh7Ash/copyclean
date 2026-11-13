# PROJECT_SPEC — copyclean

- **Name:** copyclean
- **Category:** browser-extension
- **Target user:** anyone who shares links from newsletters, search or social
- **Problem:** copying a URL carries tracking parameters and redirect wrappers
  that leak provenance and bloat links
- **Solution:** a minimal MV3 extension that cleans the active tab URL on demand
  and copies it, with a shared dependency-free core
- **Core workflow:** click icon → see original and cleaned URL → copy
- **Must-have features:** tracking-param removal, redirector unwrapping,
  fragment/ref options, persisted settings, copy action, cleanText helper
- **Nice-to-have features:** custom parameter list, keyboard shortcut
- **Stack:** JavaScript (ES modules), Manifest V3, Node for tests
- **Test strategy:** node:test over core.js for every rule, option, wrapper and
  invalid input; manifest reviewed manually for least privilege
- **Demo/result strategy:** `npm test` output plus a URL transformation table
- **Safety considerations:** no host permissions, no network requests, no
  telemetry, storage limited to two booleans
- **Definition of done:** tests pass, extension loads unpacked, docs accurate,
  no secrets
