const stripFragment = document.getElementById("stripFragment");
const removeRef = document.getElementById("removeRef");
const status = document.getElementById("status");

async function load() {
  const stored = await chrome.storage.sync.get({ stripFragment: true, removeRef: false });
  stripFragment.checked = Boolean(stored.stripFragment);
  removeRef.checked = Boolean(stored.removeRef);
}

document.getElementById("save").addEventListener("click", async () => {
  await chrome.storage.sync.set({
    stripFragment: stripFragment.checked,
    removeRef: removeRef.checked,
  });
  status.textContent = "Saved.";
  setTimeout(() => {
    status.textContent = "";
  }, 1500);
});

load().catch(() => {
  status.textContent = "Could not load settings.";
});
