/**
 * Displays a fraction as a superscript numerator and subscript denominator.
 *
 * @param {Object} props
 *   Component props.
 * @param {number} props.numerator
 *   The numerator value.
 * @param {number} props.denominator
 *   The denominator value.
 *
 * @returns {JSX.Element}
 *   The formatted fraction.
 */
export default function Fraction({ numerator, denominator }) {
  return (
    <>
      <sup>{numerator}</sup> / <sub>{denominator}</sub>
    </>
  );
}
