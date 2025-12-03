# VIGIL — Development Log

This log records the step-by-step development of the VIGIL browser extension, documenting design choices, challenges, and implemented solutions.

---

## Week 1: Project Planning
- Selected **project direction**: beginner-friendly cybersecurity extension.
- Brainstormed potential tools and applications:
  - Browser extension
  - Game for cybersecurity education
  - Cyber hygiene program
- Chose the name **VIGIL** (vigilant, watchful, professional).

---

## Week 2: Project Structure
- Defined **folder structure**:

VIGIL/
├─ background/
├─ content/
├─ popup/
├─ assets/
├─ data/
├─ script-analyzer/
├─ docs/
└─ manifest.json

- Decided on **Manifest V3** for Chrome compatibility.
- Planned modular code for scalability and readability.

---

## Week 3: Core Extension Logic
- Implemented `background.js`:
- Tab tracking
- URL history & redirect counting
- Risk scoring
- Integration with `content.js` for script analysis
- Created `content.js`:
- Counts `<script>` tags
- Estimates trackers
- Responds to background messages

---

## Week 4: Modularization
- Built `script-analyzer/analyzer.js` for reusable analysis functions:
- `analyzePageScripts()`
- `urlHasSuspiciousPattern()`
- `computeEntropy()`
- Added `utils/domain_similarity.js` for domain look-alike detection.
- Separated concerns: background handles tab events, analyzer handles logic, content handles page introspection.

---

## Week 5: Advanced Features
- Added **domain similarity detection**:
- Local JSON database of known domains (`data/known_domains.json`)
- Levenshtein distance for text similarity
- Updated risk scoring based on domain similarity
- Ensured all analysis runs **locally** (no network calls).

---

## Week 6: Popup UI
- Designed `popup.html`, `popup.css`, `popup.js`:
- Clean, readable interface
- Risk label, score, metrics, notes
- Quick actions (re-scan, copy URL, repo link)
- Tested on multiple websites (HTTP/HTTPS, script-heavy pages).

---

## Week 7: Documentation & Testing
- Created `features.md` to summarize extension capabilities
- Created `development_log.md` to explain step-by-step progress
- Tested extension thoroughly for privacy, accuracy, and user experience
- Ready for GitHub deployment and portfolio presentation

---

**Next Steps**
- Expand domain database
- Add educational hints in popup
- Prepare GitHub Pages demo site with screenshots and instructions
- Gather user feedback for iterative improvements

---

**Reflection:**  
Building VIGIL reinforced modular coding practices, browser extension development, and practical cybersecurity heuristics. The project is fully self-contained, demonstrable, and ready for university application portfolios.
