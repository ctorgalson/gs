/**
 *
 */
export default function LoadingState({ isLoading, children, fallback = "Loading..." }) {
  return isLoading ? <div aria-live="polite">{fallback}</div> : children;
}
