// copyclean core: dependency-free helpers shared by popup, options and tests.

const TRACKING_PARAMS = new Set([
  "fbclid", "gclid", "dclid", "gbraid", "wbraid", "msclkid", "mc_cid", "mc_eid",
  "igshid", "twclid", "yclid", "_hsenc", "_hsmi", "mkt_tok", "vero_id",
  "oly_anon_id", "oly_enc_id", "rb_clickid", "s_cid", "ref_src", "ref_url",
]);

const TRACKING_PREFIXES = [/^utm_/i, /^ga_/i, /^pk_/i, /^mtm_/i, /^hsa_/i];

const REDIRECT_HOSTS = new Set([
  "google.com", "www.google.com", "l.facebook.com", "lm.facebook.com",
  "out.reddit.com", "t.co", "www.youtube.com",
]);

export function isTrackingParam(key, extra = []) {
  const lowered = String(key).toLowerCase();
  if (TRACKING_PARAMS.has(lowered)) return true;
  if (extra.map((item) => String(item).toLowerCase()).includes(lowered)) return true;
  return TRACKING_PREFIXES.some((pattern) => pattern.test(key));
}

/**
 * Remove tracking parameters, fragments and known redirect wrappers.
 * @param {string} input absolute URL
 * @param {{stripFragment?: boolean, removeRef?: boolean, unwrap?: boolean, extraTracking?: string[]}} options
 * @returns {string}
 */
export function cleanUrl(input, options = {}) {
  const {
    stripFragment = true,
    removeRef = false,
    unwrap = true,
    extraTracking = [],
  } = options;

  if (typeof input !== "string" || input.trim() === "") {
    throw new TypeError("url must be a non-empty string");
  }

  let url;
  try {
    url = new URL(input.trim());
  } catch {
    throw new TypeError(`not a valid absolute URL: ${input}`);
  }

  if (unwrap && REDIRECT_HOSTS.has(url.hostname.toLowerCase())) {
    const target =
      url.searchParams.get("q") ?? url.searchParams.get("u") ?? url.searchParams.get("url");
    if (target) {
      try {
        return cleanUrl(target, { ...options, unwrap: false });
      } catch {
        // Keep the wrapper URL when the embedded target is not a valid URL.
      }
    }
  }

  for (const key of [...url.searchParams.keys()]) {
    if (isTrackingParam(key, extraTracking) || (removeRef && key.toLowerCase() === "ref")) {
      url.searchParams.delete(key);
    }
  }

  if (stripFragment) url.hash = "";
  return url.toString();
}

/** Normalise copied prose: line endings, zero-width marks, spacing, smart punctuation. */
export function cleanText(text) {
  if (typeof text !== "string") throw new TypeError("text must be a string");
  return text
    .replace(/\r\n?/g, "\n")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\u00A0/g, " ")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u2013\u2014]/g, "-")
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
