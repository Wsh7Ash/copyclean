import { cleanUrl } from "./core.js";

const sourceInput = document.getElementById("source");
const resultInput = document.getElementById("result");
const status = document.getElementById("status");
const diff = document.getElementById("diff");

function setStatus(message) {
  status.textContent = message;
}

async function loadSettings() {
  const stored = await chrome.storage.sync.get({ stripFragment: true, removeRef: false });
  return { stripFragment: Boolean(stored.stripFragment), removeRef: Boolean(stored.removeRef) };
}

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const original = tab && tab.url ? tab.url : "";
  sourceInput.value = original;
  if (!original) {
    setStatus("No URL available on this tab.");
    return;
  }

  try {
    const cleaned = cleanUrl(original, await loadSettings());
    resultInput.value = cleaned;
    diff.textContent = cleaned === original ? "Nothing to remove." : "Tracking removed.";
  } catch (error) {
    setStatus(`Cannot clean this URL: ${error.message}`);
  }
}

document.getElementById("copy").addEventListener("click", async () => {
  if (!resultInput.value) return;
  try {
    await navigator.clipboard.writeText(resultInput.value);
    setStatus("Copied.");
  } catch {
    setStatus("Copy failed; select the field and copy manually.");
  }
});

document.getElementById("options").addEventListener("click", () => chrome.runtime.openOptionsPage());

init().catch((error) => setStatus(`Error: ${error.message}`));
