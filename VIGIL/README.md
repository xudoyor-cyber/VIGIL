# VIGIL — Cybersecurity Browser Extension

**VIGIL** is a lightweight, privacy-first browser extension designed to help users identify potentially risky websites in real-time. By analyzing URLs, scripts, and domain patterns **locally in the browser**, VIGIL provides clear risk indicators, alerts for look-alike domains, and actionable insights — all without sending any data to external servers.

![VIGIL Screenshot](docs/assets/vigil-screenshot.png)  

---

## 🚀 Features

- **Risk Scoring**
  - Assigns a numeric score (0-100) and risk label (Low / Medium / High) based on:
    - HTTPS usage
    - Redirect chains
    - Script count
    - Suspicious URL patterns
    - Hostname entropy
- **Domain Similarity Detection**
  - Detects look-alike domains compared to a curated database of popular brands, banks, and shopping sites
  - Warns users of potential phishing attempts
- **Script & Tracker Analysis**
  - Counts scripts on a page
  - Estimates third-party trackers
  - Provides notes to inform safer browsing
- **User-Friendly Popup**
  - Displays risk score, metrics, and human-readable notes
  - Quick actions: reload & re-scan page, copy URL, access GitHub repo
- **Privacy & Local Processing**
  - All computations are performed locally
  - No data leaves your browser
- **Modular & Extensible**
  - Clean code structure, easy to expand with new heuristics or domain data

---

## 📂 Project Structure

VIGIL/
├─ background/ # Handles tab events, risk scoring
├─ content/ # Analyzes page scripts and trackers
├─ popup/ # UI for popup.html, CSS, and JS
├─ assets/ # Icons, logos
├─ data/ # Known domain database
├─ script-analyzer/ # Core analysis logic
├─ utils/ # Helper functions (domain similarity, Levenshtein)
├─ docs/ # Documentation & development logs
└─ manifest.json # Chrome extension configuration

---

## ⚡ Installation (Developer Mode)

1. Clone or download this repository:
2. Open Chrome (or any Chromium browser).
3. Go to chrome://extensions/.
4. Enable Developer mode (top-right toggle).
5. Click Load unpacked and select the VIGIL/ folder.
6. Pin the VIGIL icon in your toolbar.
7. Open any website tab and click the VIGIL icon to see the risk analysis.

🛠 How It Works
1. Background service worker
2. Tracks tab updates and URL changes
3. Stores last scan results
4. Content script
5. Counts scripts and detects tracker patterns
6. Analyzer module (analyzer.js)
8. Encapsulates core logic for script analysis, URL pattern checking, and entropy calculation
9. Domain similarity
10. Compares current domain with trusted domains using Levenshtein distance
11. Popup
12. Reads stored scan results
13. Presents a clean, readable summary with actionable notes
14. All analysis is client-side, ensuring privacy and instant feedback.

📈 Future Enhancements
-Gamified educational hints for safer browsing
-Local dashboard to track scanned pages
-Advanced heuristics:
-Recently registered domains
-Suspicious TLDs or IP-only URLs
-Unicode / punycode checks
-Browser compatibility expansion (Firefox, Edge)

Created by Sirojiddinov Khudoyor — Vigilant about cybersecurity, practical about learning.