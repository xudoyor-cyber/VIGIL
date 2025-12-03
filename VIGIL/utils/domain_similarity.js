// utils/domain_similarity.js

// Simple Levenshtein distance
export function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[a.length][b.length];
}

/**
 * knownDomains - object with groups -> arrays (example file provided earlier)
 * returns array of hits: [{ domain, editDistance, group }]
 */
export function findSimilarDomains(domain, knownDomains, threshold = 3) {
  if (!domain) return [];
  const hits = [];

  // knownDomains might be an object with arrays
  for (const groupName of Object.keys(knownDomains || {})) {
    const arr = knownDomains[groupName];
    if (!Array.isArray(arr)) continue;
    for (const known of arr) {
      try {
        // remove www and basic normalization
        const k = known.replace(/^www\./, "").toLowerCase();
        const d = domain.replace(/^www\./, "").toLowerCase();
        const dist = levenshtein(d, k);
        if (dist <= threshold) {
          hits.push({ domain: k, editDistance: dist, group: groupName });
        }
      } catch (e) { /* ignore bad entries */ }
    }
  }

  return hits.sort((a, b) => a.editDistance - b.editDistance);
}
