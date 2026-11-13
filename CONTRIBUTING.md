# Contributing

## Setup

No install step is required for the extension. For tests:

```shell
npm test
```

## Rules to preserve

- `core.js` stays dependency-free and browser-agnostic.
- Non-tracking parameters keep their original order.
- Unknown parameters are never removed silently (add them explicitly).
- The manifest must not request host permissions; the popup uses `activeTab`.

## Adding a tracking parameter

1. Add it to `TRACKING_PARAMS` (or `TRACKING_PREFIXES` for families).
2. Add one test proving it is removed and one proving a lookalike stays.
3. Update the parameter list in `README.md`.

## Adding a redirector

Add the host to `REDIRECT_HOSTS` and cover it with an encoded-target test.
