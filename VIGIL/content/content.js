// content/content.js
// Responds to background sendMessage if present (may not be used since background uses scripting.executeScript)

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.cmd === "getScriptInfo") {
    try {
      const scripts = Array.from(document.scripts || []);
      const scriptCount = scripts.length;
      const trackerEstimate = scripts.filter(s => /(analytics|google-analytics|googletagmanager|doubleclick|facebook|ads|hotjar|mixpanel|segment|amplitude|yandex)/i.test((s.src || "") + (s.textContent || ""))).length;
      sendResponse({ scriptCount, trackerEstimate });
    } catch (e) {
      sendResponse({ scriptCount: 0, trackerEstimate: 0 });
    }
    return true;
  }
});
