// popup/popup.js
const $ = id => document.getElementById(id);

let state = { lastScan: null, currentTab: null };

async function init() {
  showLoading();
  state.currentTab = await getActiveTab();
  // read stored scan and show only if it matches current tab
  chrome.storage.local.get("lastScan", (data) => {
    const scan = data && data.lastScan ? data.lastScan : null;
    if (scan && state.currentTab && scan.url === state.currentTab.url) {
      state.lastScan = scan;
    } else {
      state.lastScan = null;
    }
    render();
  });

  attachHandlers();
}

function getActiveTab() {
  return new Promise(resolve => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs && tabs[0] ? tabs[0] : null);
    });
  });
}

function showLoading() {
  $("loading").classList.remove("hidden");
  $("summary").classList.add("hidden");
  $("noData").classList.add("hidden");
}

function showNoData() {
  $("loading").classList.add("hidden");
  $("summary").classList.add("hidden");
  $("noData").classList.remove("hidden");
}

function showSummary() {
  $("loading").classList.add("hidden");
  $("summary").classList.remove("hidden");
  $("noData").classList.add("hidden");
}

function render() {
  const s = state.lastScan;
  if (!s) {
    showNoData();
    return;
  }

  showSummary();

  $("riskScore").innerText = `${s.riskScore ?? 0}`;
  const label = s.riskLabel || "Unknown";
  const labelEl = $("riskLabel");
  labelEl.innerText = label;

  const score = s.riskScore ?? 0;
  const scoreFill = $("scoreFill");
  if (score >= 65) {
    labelEl.style.backgroundColor = "#fdecea";
    labelEl.style.color = "#7f1d1d";
    scoreFill.style.background = "#ef4444";
  } else if (score >= 35) {
    labelEl.style.backgroundColor = "#fff7ed";
    labelEl.style.color = "#7c2d12";
    scoreFill.style.background = "#eab308";
  } else {
    labelEl.style.backgroundColor = "#ecfdf5";
    labelEl.style.color = "#065f46";
    scoreFill.style.background = "#16a34a";
  }
  scoreFill.style.width = `${Math.max(0, Math.min(100, score))}%`;

  const details = $("details");
  details.innerHTML = "";
  if (s.notes && s.notes.length) {
    s.notes.forEach(n => {
      const li = document.createElement("li");
      li.textContent = n;
      details.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.textContent = "No immediate risk factors detected.";
    details.appendChild(li);
  }

  if (s.similarity && s.similarity.length) {
    const li = document.createElement("li");
    li.textContent = `Similar to: ${s.similarity.map(x => x.domain + " (+" + x.editDistance + ")").join(", ")}`;
    details.appendChild(li);
  }

  $("httpsVal").innerText = s.https ? "Yes" : "No";
  $("redirectVal").innerText = s.redirectCount ?? "-";
  $("scriptsVal").innerText = s.scriptCount ?? "-";
  $("trackersVal").innerText = s.trackerEstimate ?? "-";

  $("explain").classList.remove("hidden");
  $("repoLink").href = "https://github.com/YOUR-USERNAME/VIGIL";
  $("repoLink").innerText = "VIGIL on GitHub";
}

function attachHandlers() {
  $("rescanBtn").addEventListener("click", async () => {
    const tab = state.currentTab;
    if (!tab || !tab.id || !tab.url) return;

    // ask background to rescan now
    $("rescanBtn").innerText = "Scanning…";
    chrome.runtime.sendMessage({ cmd: "rescan", tabId: tab.id, url: tab.url }, (resp) => {
      $("rescanBtn").innerText = "Scan this page";
      if (resp && resp.ok && resp.result) {
        state.lastScan = resp.result;
        render();
      } else {
        // If background failed, still try to read storage after short delay
        setTimeout(() => {
          chrome.storage.local.get("lastScan", (d) => {
            const scan = d && d.lastScan ? d.lastScan : null;
            if (scan && scan.url === (state.currentTab && state.currentTab.url)) {
              state.lastScan = scan;
            } else {
              state.lastScan = null;
            }
            render();
          });
        }, 600);
      }
    });
  });

  $("doScanBtn")?.addEventListener("click", async () => {
    // same as rescan
    $("rescanBtn").click();
  });

  $("copyUrlBtn").addEventListener("click", async () => {
    const url = (state.currentTab && state.currentTab.url) || (state.lastScan && state.lastScan.url) || "";
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      $("copyUrlBtn").innerText = "Copied!";
      setTimeout(() => $("copyUrlBtn").innerText = "Copy URL", 1200);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url; document.body.appendChild(ta);
      ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
      $("copyUrlBtn").innerText = "Copied!";
      setTimeout(() => $("copyUrlBtn").innerText = "Copy URL", 1200);
    }
  });
}

init();
