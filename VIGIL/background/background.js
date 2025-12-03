// background/background.js
import { computeEntropy, urlHasSuspiciousPattern } from "../script-analyzer/analyzer.js";
import { findSimilarDomains } from "../utils/domain_similarity.js";

const urlHistory = {}; // tabId -> [urls]

// Load known domains file (returns array/object as stored)
async function loadKnownDomains() {
  try {
    const url = chrome.runtime.getURL("data/known_domains.json");
    const r = await fetch(url);
    if (!r.ok) return {};
    return await r.json();
  } catch (e) {
    console.error("Failed to load known domains:", e);
    return {};
  }
}

// Get script info by executing a function in the page and returning its result
async function getScriptInfoViaScripting(tabId) {
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        // runs in the page context
        const scripts = Array.from(document.scripts || []);
        const scriptCount = scripts.length;
        const trackerKeywords = ["google-analytics", "googletagmanager", "doubleclick", "facebook", "ads", "analytics", "gtag", "hotjar", "mixpanel", "segment", "amplitude", "yandex"];
        let trackerEstimate = 0;
        for (const s of scripts) {
          try {
            const src = (s.src || "").toLowerCase();
            const txt = (s.textContent || "").toLowerCase();
            const combined = src + " " + txt;
            if (trackerKeywords.some(k => combined.includes(k))) trackerEstimate++;
          } catch (err) { /* ignore */ }
        }
        return { scriptCount, trackerEstimate };
      }
    });

    // executeScript returns an array; take first result
    if (Array.isArray(results) && results.length > 0) {
      return results[0].result || { scriptCount: 0, trackerEstimate: 0 };
    }
    return { scriptCount: 0, trackerEstimate: 0 };
  } catch (err) {
    // Happens on pages where execution is disallowed (chrome://, extensions page, pdf viewer, etc.)
    return { scriptCount: 0, trackerEstimate: 0 };
  }
}

function trackUrl(tabId, url) {
  if (!urlHistory[tabId]) urlHistory[tabId] = [];
  const hist = urlHistory[tabId];
  if (hist.length === 0 || hist[hist.length - 1] !== url) hist.push(url);
  if (hist.length > 12) hist.shift();
}

async function analyzeTab(tabId, url) {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, "");

    // Get page script/tracker info
    const scriptData = await getScriptInfoViaScripting(tabId);

    // Similar domains
    const knownDomains = await loadKnownDomains();
    const similar = findSimilarDomains(hostname, knownDomains, 3);

    const entropy = computeEntropy(hostname);
    const suspiciousURL = urlHasSuspiciousPattern(url);
    const redirectCount = (urlHistory[tabId]?.length || 1) - 1;

    // Simple risk score
    let score = 0;
    score += parsed.protocol === "https:" ? 20 : 0;
    score += suspiciousURL ? 30 : 0;
    score += entropy > 3.8 ? 20 : 0;
    score += Math.min(scriptData.scriptCount, 20);
    if (similar.length > 0) score += (similar[0].editDistance <= 1 ? 30 : 10);

    const riskScore = Math.max(0, Math.min(100, Math.round(score)));
    const riskLabel = riskScore >= 65 ? "High" : riskScore >= 35 ? "Medium" : "Low";

    const payload = {
      url,
      hostname,
      https: parsed.protocol === "https:",
      redirectCount,
      ...scriptData,
      entropy,
      suspiciousURL,
      similarity: similar,
      riskScore,
      riskLabel,
      notes: []
    };

    if (suspiciousURL) payload.notes.push("URL contains common phishing keywords.");
    if (entropy > 3.8) payload.notes.push("Hostname appears random (high entropy).");
    if (scriptData.trackerEstimate > 3) payload.notes.push("Multiple third-party trackers detected.");
    if (similar.length) payload.notes.push(`Domain looks similar to: ${similar.map(s => s.domain).join(", ")}`);

    // Store for popup to read
    chrome.storage.local.set({ lastScan: payload });
    return payload;
  } catch (err) {
    console.error("analyzeTab error:", err);
    return null;
  }
}

// Listen for tab updates to do automatic analysis
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  try {
    if (changeInfo.url) trackUrl(tabId, changeInfo.url);

    // analyze when a page finishes loading (avoid special pages)
    if (changeInfo.status === "complete" && tab && tab.url && !tab.url.startsWith("chrome://") && !tab.url.startsWith("chrome-extension://")) {
      analyzeTab(tabId, tab.url);
    }
  } catch (e) {
    console.error("tabs.onUpdated error", e);
  }
});

// Clean up when tab is removed
chrome.tabs.onRemoved.addListener(tabId => {
  delete urlHistory[tabId];
});

// Message handler — used by popup to request immediate scan
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    if (msg?.cmd === "rescan" && msg.tabId && msg.url) {
      const result = await analyzeTab(msg.tabId, msg.url);
      sendResponse({ ok: !!result, result });
    } else if (msg?.cmd === "ping") {
      sendResponse({ ok: true });
    } else {
      sendResponse({ ok: false });
    }
  })();
  // return true to indicate async sendResponse
  return true;
});
