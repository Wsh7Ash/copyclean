# Usage

## Install unpacked

`chrome://extensions` → Developer mode → *Load unpacked* → pick `extension/`.
The folder contains no build output; the shipped files are the extension.

## Daily use

1. Open the page you want to share.
2. Click the copyclean icon.
3. Confirm the clean link and press *Copy clean link*.

The popup strips the fragment by default, because `#section` rarely matters when
sharing a link, and shows "Nothing to remove" when the URL is already clean.

## Settings

Open *Options* from the popup:

- **Remove the #fragment when copying** — turn off when the anchor is the point
  (for example documentation deep links).
- **Remove a bare `ref` parameter** — some sites use `ref` for tracking, others
  for real routing; leave it off unless you know the site.

Settings are stored per browser profile via `chrome.storage.sync`.

## Using the core without the extension

```js
import { cleanUrl, cleanText } from "./extension/core.js";

cleanUrl("https://example.com/x?utm_source=mail&id=3", { stripFragment: false });
cleanText("  Hello\u00A0world  ");
```

Because `core.js` only uses standard globals (`URL`), it runs unchanged in Node,
Deno, workers and page scripts.

## What is not removed

Parameters such as `id`, `page`, `q`, `lang` and `v` are kept: they identify
content. If a site has a custom tracking key, add it to `TRACKING_PARAMS` and
cover it with a test.
