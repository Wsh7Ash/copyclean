import test from "node:test";
import assert from "node:assert/strict";

import { cleanText, cleanUrl, isTrackingParam } from "../extension/core.js";

test("removes tracking parameters and keeps the rest", () => {
  const cleaned = cleanUrl(
    "https://example.com/article?id=42&utm_source=news&utm_medium=email&fbclid=abc&page=2",
  );
  assert.equal(cleaned, "https://example.com/article?id=42&page=2");
});

test("treats prefixed and explicit tracking keys as tracking", () => {
  assert.equal(isTrackingParam("utm_campaign"), true);
  assert.equal(isTrackingParam("GA_SESSION"), true);
  assert.equal(isTrackingParam("gclid"), true);
  assert.equal(isTrackingParam("page"), false);
  assert.equal(isTrackingParam("referrer", ["referrer"]), true);
});

test("keeps ref by default and removes it on request", () => {
  const url = "https://example.com/x?ref=homepage&id=7";
  assert.equal(cleanUrl(url, { removeRef: false }), "https://example.com/x?ref=homepage&id=7");
  assert.equal(cleanUrl(url, { removeRef: true }), "https://example.com/x?id=7");
});

test("strips the fragment unless disabled", () => {
  assert.equal(cleanUrl("https://example.com/doc#section-3"), "https://example.com/doc");
  assert.equal(
    cleanUrl("https://example.com/doc#section-3", { stripFragment: false }),
    "https://example.com/doc#section-3",
  );
});

test("unwraps known redirect links", () => {
  const wrapped =
    "https://www.google.com/url?q=" + encodeURIComponent("https://example.org/page?utm_source=x&id=1") +
    "&sa=D&ust=1";
  assert.equal(cleanUrl(wrapped), "https://example.org/page?id=1");

  const facebook = "https://l.facebook.com/l.php?u=" + encodeURIComponent("https://example.org/a?fbclid=z");
  assert.equal(cleanUrl(facebook), "https://example.org/a");
});

test("normalises bare hosts through the URL parser", () => {
  assert.equal(cleanUrl("https://Example.COM"), "https://example.com/");
});

test("rejects invalid input", () => {
  assert.throws(() => cleanUrl("example.com/no-scheme"), TypeError);
  assert.throws(() => cleanUrl("   "), TypeError);
  assert.throws(() => cleanUrl(42), TypeError);
});

test("cleanText normalises whitespace and punctuation", () => {
  const messy = "  Hello\u00A0world  \r\n\r\n\r\nShe said \u201Chi\u201D \u2014 and\u200B left.  ";
  assert.equal(cleanText(messy), 'Hello world\n\nShe said "hi" - and left.');
});

test("cleanText rejects non-strings", () => {
  assert.throws(() => cleanText(null), TypeError);
});
