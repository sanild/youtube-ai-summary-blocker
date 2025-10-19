function hideSummary() {
  const summary = document.querySelector("#expandable-metadata");
  if (summary) summary.style.display = "none";
}

function showSummary() {
  const summary = document.querySelector("#expandable-metadata");
  if (summary) summary.style.display = "";
}

let observer = null;
let enabled = false;

function startObserver() {
  if (observer) return; 

  observer = new MutationObserver(() => {
    if (enabled) hideSummary();
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function stopObserver() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  showSummary();
}

chrome.storage.sync.get("enabled", (data) => {
  enabled = data.enabled ?? true;
  if (enabled) {
    hideSummary();
    startObserver();
  }
});

chrome.storage.onChanged.addListener((changes, ns) => {
  if (ns === "sync" && changes.enabled) {
    enabled = changes.enabled.newValue;
    if (enabled) {
      hideSummary();
      startObserver();
    } else {
      stopObserver();
    }
  }
});
