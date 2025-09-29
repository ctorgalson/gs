import { useEffect, useRef, useState } from "preact/hooks";
import { highlight } from "best-highlight";
import "best-highlight/themes/light.css";
import ErrorBoundary from "./ErrorBoundary";

/**
 * Renders a syntax-highlighted code block with a download link.
 *
 * @param {Object} props
 *   Component props.
 * @param {string} [props.className]
 *   Additional CSS class for the container.
 * @param {string} props.code
 *   The code content to display and highlight.
 * @param {React.ReactNode} [props.heading]
 *   Optional heading element to display above the code.
 * @param {string} props.language
 *   Programming language for syntax highlighting.
 * @param {string} [props.downloadFilename]
 *   Filename for the download link.
 * @param {string} [props.downloadLinkText]
 *   Display text for the download link.
 *
 * @returns {JSX.Element}
 *   The rendered code block component.
 */
export default function Code({
  className,
  code,
  heading,
  language,
  downloadFilename,
  downloadLinkText,
  downloadMimeType,
}) {
  const [highlighted, setHighlighted] = useState(null);
  const codeRef = useRef(null);

  useEffect(() => {
    if (code) {
      setHighlighted(highlight(code, language));
    }
  }, [code, language]);

  return (
    <ErrorBoundary>
      <div className={className}>
        {heading}
        <ul>
          <li>
            <CodeDownloadLink
              code={code}
              mimeType={downloadMimeType}
              filename={downloadFilename}
              linkText={downloadLinkText}
            />
          </li>
          <li><CodeCopyLink targetRef={codeRef} /></li>
        </ul>
        <pre className={`language-${language}`}>
          <code
            ref={codeRef}
            tabindex="0"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </pre>
      </div>
    </ErrorBoundary>
  );
}

/**
 * @param {Object} props
 *   Component props.
 * @param {React.RefObject} props.targetRef
 *   React ref object pointing to the DOM element.
 *
 * @returns {JSX.Element}
 *   The rendered code block component.
 */
function CodeCopyLink({ targetRef }) {
  /**
   * Copies the text content of the code block to the clipboard.
   *
   * @param {React.RefObject} elementRef
   *   React ref object pointing to the DOM element.
   * @returns {Promise<void>}
   *   Promise that resolves when content is copied successfully.
   * @throws {Error}
   *   Throws if element ref is null or clipboard access fails.
   */
  async function handleClick() {
    try {
      const code = targetRef.current.textContent;
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }

  const [copied, setCopied] = useState(false);

  return targetRef.current ? (
    <button onClick={handleClick}>{copied ? "Copied code" : "Copy code"}</button>
  ) : null;
}

/**
 * Renders a download link for code content using a blob URL.
 *
 * @param {Object} props
 *   Component props.
 * @param {string} props.code
 *   The code content to download.
 * @param {string} [props.filename]
 *   Filename for the downloaded file.
 * @param {string} [props.linkText]
 *   Display text for the download link.
 * @param {string} props.mimeType
 *   MIME type for the blob.
 *
 * @returns {JSX.Element|null}
 *   The download link or null if required props are missing.
 */
function CodeDownloadLink({ code, filename, linkText, mimeType }) {
  const [downloadUrl, setDownloadUrl] = useState(null);

  useEffect(() => {
    if (code) {
      const blob = new Blob([code], { type: mimeType });
      const downloadUrl = URL.createObjectURL(blob);

      setDownloadUrl(downloadUrl);

      return () => URL.revokeObjectURL(downloadUrl);
    }

  }, [code]);

  return (filename && downloadUrl && linkText) ? (
    <a download={filename} href={downloadUrl}>{linkText}</a>
  ) : null;
}
