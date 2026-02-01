import React from 'react';

/**
 * Renders the word "Vicar" with the letter "i" in OPPO Sans (lowercase)
 * so it displays correctly when the parent uses Bebas (which only has capitals).
 * Use this anywhere the brand name "Vicar" should show a small "i".
 */
function VicarWord() {
  return (
    <>
      <span>V</span>
      <span className="vicar-i" aria-hidden="true">i</span>
      <span>car</span>
    </>
  );
}

/**
 * Splits a string by "Vicar" (any case: Vicar, ViCAR, VICAR) and returns
 * React nodes with VicarWord component for each match. Use for translated
 * strings that contain the brand name.
 * @param {string} str - e.g. "© 2026 Vicar. All rights reserved." or "ViCAR Premium Mobility"
 * @returns {React.ReactNode[]} - array of strings and VicarWord elements
 */
export function renderWithVicar(str) {
  if (typeof str !== 'string') return str;
  const parts = str.split(/(Vicar|ViCAR|VICAR)/gi);
  return parts.map((part, i) =>
    /^Vicar$/i.test(part) ? <VicarWord key={`vicar-${i}`} /> : part
  );
}

export default VicarWord;
