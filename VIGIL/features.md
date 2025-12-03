# VIGIL — Features Overview

**VIGIL** is a lightweight, privacy-first browser extension designed to help users evaluate the safety of websites. It focuses on local, client-side analysis to provide instant feedback on potential cybersecurity risks.

## Key Features

### 1. Risk Scoring
- Provides a **numeric risk score (0-100)** for the current webpage.
- Categorizes sites into **Low, Medium, or High risk**.
- Scoring considers:
  - HTTPS protocol
  - Redirect chains
  - Number of scripts loaded
  - Suspicious URL patterns
  - Hostname entropy (random-looking URLs)

### 2. Domain Similarity Detection
- Compares current domain with a curated database of popular brands, banks, and shopping sites.
- Flags domains that are **visually or textually similar** (edit distance ≤ 3) to known trusted domains.
- Warns users when the current site could be a **lookalike/phishing site**.

### 3. Script & Tracker Analysis
- Counts `<script>` tags in the webpage.
- Estimates presence of third-party trackers using known keywords.
- Provides warnings if excessive scripts or trackers are detected.

### 4. User-Friendly Popup
- Clean, minimal interface showing:
  - Risk label and numeric score
  - Metrics: HTTPS status, redirects, script count, trackers
  - Human-readable notes explaining findings
- Provides **quick actions**:
  - Reload & re-scan page
  - Copy current URL
  - Access GitHub repo

### 5. Privacy & Local Processing
- All analysis occurs **locally in the browser**; no external requests or cloud processing.
- Users’ browsing data is **never sent to a server**.

### 6. Modular, Extensible Code
- Core logic in `script-analyzer/analyzer.js` for maintainability.
- Easy to expand:
  - Add new phishing patterns
  - Add more domains to `data/known_domains.json`
  - Incorporate additional heuristics in the analyzer

---

## Future Enhancements (Planned)
- Dashboard for local history of scanned pages
- Additional heuristics: TLD checks, IP-only URLs, punycode detection
- Gamified or educational popup hints for safer browsing

---

**Conclusion:**  
VIGIL is designed as a **lightweight, ethical, educational cybersecurity tool** suitable for any user and fully demonstrable for admissions purposes.
