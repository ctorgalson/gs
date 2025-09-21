import { Component } from 'preact';

/**
 * Error boundary component that catches JavaScript errors in child components
 * and displays a fallback UI instead of crashing the entire component tree.
 *
 * @class ErrorBoundary
 * @extends {Component}
 *
 * @example
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component {
  /**
   * Creates an instance of ErrorBoundary.
   *
   * @param {Object} props
   *   Component props.
   */
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * Static lifecycle method called when a descendant component throws an error.
   * Updates state to trigger error UI rendering.
   *
   * @static
   * @param {Error} error
   *   The error that was thrown.
   * @returns {Object}
   *   New state object.
   */
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  /**
   * Lifecycle method called after an error has been thrown by a descendant
   * component. Used for logging error information.
   *
   * @param {Error} error
   *   The error that was thrown.
   * @param {Object} errorInfo
   *   Object with componentStack key containing stack trace.
   */
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  /**
   * Renders either the fallback UI or the child components.
   *
   * @returns {JSX.Element}
   *   Fallback UI if error occurred, otherwise children.
   */
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
