# Architecture

## Shape

```text
popup.js ──► chrome.tabs.query(active tab) ──► core.cleanUrl ──► clipboard
                      │                              ▲
                      └── chrome.storage.sync ───────┘ (options)

tests/core.test.mjs ──► core.cleanUrl / core.cleanText   (Node, no browser)
```

The extension has no background worker: everything happens on explicit user
interaction, which keeps permissions minimal (`activeTab`, `storage`,
`clipboardWrite`).

## URL cleaning order

1. Parse with the platform `URL` (rejects relative or malformed input).
2. If the host is a known redirector and it carries `q`/`u`/`url`, recurse once
   into that target (recursion disabled for the inner call to avoid loops).
3. Delete tracking keys: exact set, user extras, and prefix families.
4. Optionally delete a bare `ref` and strip the fragment.
5. Serialise with `URL.toString()`, which normalises scheme/host casing and
   adds a trailing slash for bare hosts.

`URLSearchParams.delete` may reorder repeated keys, but it preserves the relative
order of the remaining parameters, which is what the tests pin.

## Text cleaning

Line endings are normalised to `\n`, zero-width characters removed, NBSP turned
into spaces, smart quotes/dashes converted to ASCII, and runs of spaces and
blank lines collapsed. This is for pasted prose, not for URLs.

## Failure behaviour

`cleanUrl` throws `TypeError` for empty or invalid input; the popup catches it
and shows a message instead of copying a broken link. Redirect unwrapping that
fails falls back to the wrapper URL rather than throwing.
