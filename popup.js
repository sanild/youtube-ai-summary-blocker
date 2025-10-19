document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("toggle");
  const statusText = document.getElementById("status-text");

  // Load saved state
  chrome.storage.sync.get("enabled", (data) => {
    const enabled = data.enabled ?? true;
    toggle.checked = enabled;
    if (statusText) statusText.textContent = enabled ? "Blocking is ON" : "Blocking is OFF";
  });

  // Save state + refresh current tab (original way)
  toggle.addEventListener("change", () => {
    const enabled = toggle.checked;
    chrome.storage.sync.set({ enabled }, () => {
      if (statusText) statusText.textContent = enabled ? "Blocking is ON" : "Blocking is OFF";

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.reload(tabs[0].id);   // ← original working method
        }
      });
    });
  });
});
