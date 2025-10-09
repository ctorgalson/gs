/**
 * Performs a factorization of the incoming columns value using its root.
 *
 * @param {number} columns
 *   The number of columns the grid system will use.
 * @param {number[]}
 *   The list of factors, excluding 1, sorted ASC (we don't care about 1 for
 *   the purpose of creating grid-columns).
 */
export default function factorizeColumnCount(columns) {
  const factors = [];
  const n = parseInt(columns, 10);

  if (isNaN(n)) {
    throw new TypeError("Received a non-numeric value for `columns`.");
  }

  for (let i = 1; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      const complement = n / i;

      factors.push(i);

      // Only add n / 1 to factors if it's not a perfect square.
      if (i !== complement) {
        factors.push(complement);
      }
    }
  }

  // We don't care that much about 1 as a factor for CSS purposes.
  return factors.sort((a, b) => a - b).slice(1);
}
