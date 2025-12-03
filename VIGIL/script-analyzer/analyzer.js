// script-analyzer/analyzer.js

export function computeEntropy(str) {
  if (!str) return 0;
  const s = str;
  const freq = {};
  for (const ch of s) freq[ch] = (freq[ch] || 0) + 1;
  const len = s.length;
  let entropy = 0;
  for (const k in freq) {
    const p = freq[k] / len;
    entropy -= p * Math.log2(p);
  }
  return entropy;
}

export function urlHasSuspiciousPattern(url) {
  const patterns = [
    /verify[-_.]?(account|login|user)?/i,
    /login[-_.]?secure/i,
    /free[-_.]?gift/i,
    /update[-_.]?billing/i,
    /confirm[-_.]?payment/i,
    /secure[-_.]?paypal/i,
    /account[-_.]?verify/i,
    /verify-login/i,
    /verify-user/i,
    /auth[-_.]?check/i,
    /password[-_.]?reset/i
  ];
  return patterns.some(rx => rx.test(url));
}
