import { cleanText, cleanUrl } from "../extension/core.js";

const samples = [
  "https://example.com/article?id=42&utm_source=news&utm_medium=email&fbclid=abc&page=2",
  "https://www.google.com/url?q=https%3A%2F%2Fexample.org%2Fpage%3Futm_source%3Dx%26id%3D1&sa=D&ust=1",
  "https://l.facebook.com/l.php?u=https%3A%2F%2Fexample.org%2Fa%3Ffbclid%3Dz",
  "https://example.com/doc#section-3",
  "https://example.com/x?ref=homepage&id=7",
];

for (const sample of samples) {
  console.log(`${sample}\n  -> ${cleanUrl(sample)}`);
}

console.log("\ncleanText:");
console.log(
  cleanText("  Hello\u00A0world  \r\n\r\n\r\nShe said \u201Chi\u201D \u2014 and\u200B left.  "),
);
