# copyclean

**Copy links without the tracking junk — a tiny Manifest V3 extension for the
page you are actually reading.**

## Why

Copying a URL from a newsletter, search result or social feed usually copies
`?utm_source=…&fbclid=…` and, on Google/Facebook, the whole redirect wrapper.
That leaks where you came from and makes links long enough to break in chat.
`copyclean` reads the active tab, removes tracking parameters, unwraps known
redirectors, and copies the clean link with one click. All logic runs locally.

## Features

- Removes `utm_*`, `ga_*`, `fbclid`, `gclid`, `msclkid`, `mc_cid`/`mc_eid`,
  `igshid`, `_hsenc` and related parameters
- Unwraps `google.com/url?q=`, `l.facebook.com/l.php?u=` and similar wrappers
- Optional fragment stripping and optional removal of a bare `ref`
- Preserves all non-tracking parameters and their order
- `cleanText` helper normalises zero-width characters, NBSP, smart quotes and
  blank lines
- No host permissions, no background network calls, no analytics

## Example

Core output (verified by the test suite):

```text
cleanUrl("https://example.com/article?id=42&utm_source=news&fbclid=abc&page=2")
  -> "https://example.com/article?id=42&page=2"

cleanUrl("https://www.google.com/url?q=https%3A%2F%2Fexample.org%2Fpage%3Futm_source%3Dx%26id%3D1&sa=D")
  -> "https://example.org/page?id=1"
```

## Architecture

```text
extension/core.js       pure helpers: cleanUrl, cleanText, isTrackingParam
extension/popup.*       active-tab reader and copy button
extension/options.*     persisted settings (stripFragment, removeRef)
extension/manifest.json MV3 manifest: activeTab, storage, clipboardWrite
tests/core.test.mjs     node:test coverage for every rule
```

`core.js` is dependency-free and browser-agnostic apart from `URL`, which makes
it testable under Node and reusable from any page script.

## Requirements

- Chrome/Edge/Brave with extension developer mode, or Firefox with MV3 support
- Node 20+ only for running the tests
- No build step

## Installation (browser)

1. Open `chrome://extensions` and enable Developer mode.
2. Choose *Load unpacked* and select the `extension/` directory.
3. Pin the extension. Clicking it shows the clean link for the current tab.

## Installation (tests)

```shell
git clone https://github.com/Wsh7Ash/copyclean.git
cd copyclean
npm test
```

## Quick start

```text
Open a page with tracking parameters → click the copyclean icon →
“Copy clean link”.
```

## Usage

- **Popup**: shows the original URL and the cleaned one, with a copy button.
- **Options**: toggle fragment stripping and bare `ref` removal. Settings sync
  through `chrome.storage.sync`.
- **Programmatic**:

```js
import { cleanUrl } from "./extension/core.js";
cleanUrl("https://example.com/x?utm_medium=email");
```

## Configuration

Two booleans stored in `chrome.storage.sync`:

| Setting | Default | Effect |
|---|---|---|
| `stripFragment` | `true` | removes `#section` from copied links |
| `removeRef` | `false` | removes a bare `ref` parameter |

## Testing

```shell
npm test        # node --test tests/core.test.mjs
```

## Project structure

```text
copyclean/
├─ extension/          loadable extension (no build)
├─ tests/              node:test suite
├─ examples/           sample URLs
├─ docs/               architecture, usage, spec
├─ results/            generated test output
└─ .github/workflows/  CI
```

## Limitations

- The tracking-parameter list is curated; unknown campaign parameters survive.
- Redirector unwrapping covers a fixed host list, not every shortener.
- No automatic clipboard replacement: copying is an explicit click.
- Popup UI is intentionally minimal; there is no history or sync of links.

## Roadmap

- User-defined extra parameters in options
- Firefox packaging notes
- Optional keyboard shortcut

## Privacy notes

The extension requests `activeTab` only when you click it, stores two booleans in
browser sync storage, and never sends URLs anywhere. There is no telemetry.

## License

MIT — see `LICENSE`.
