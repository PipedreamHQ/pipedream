"use client";

import {
  useState, useEffect,
} from "react";
import "prismjs/themes/prism.css";

// We'll dynamically import Prism on the client side only
let Prism;

export default function CodeBlock({
  code, language = "javascript", className = "",
}) {
  const [
    copied,
    setCopied,
  ] = useState(false);
  const [
    highlightedCode,
    setHighlightedCode,
  ] = useState(code);
  const [
    isClient,
    setIsClient,
  ] = useState(false);

  // Load Prism and highlight code on client-side only
  useEffect(() => {
    setIsClient(true);

    const loadPrism = async () => {
      Prism = (await import("prismjs")).default;

      // Use manual mode so we can control highlighting
      Prism.manual = true;

      // Import language definitions dynamically
      if (!Prism.languages.javascript) {
        await import("prismjs/components/prism-javascript");
      }

      if (!Prism.languages.json && language === "json") {
        await import("prismjs/components/prism-json");
      }

      // Apply syntax highlighting
      try {
        if (Prism.languages[language]) {
          const highlighted = Prism.highlight(code, Prism.languages[language], language);
          setHighlightedCode(highlighted);
        }
      } catch (error) {
        console.error("Prism highlighting error:", error);
      }
    };

    loadPrism();
  }, [
    code,
    language,
  ]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative group ${className}`}>
      <pre className="overflow-x-auto rounded-lg font-medium border border-gray-200 bg-gray-50 p-4 text-[13px] leading-relaxed mb-0">
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={copyToClipboard}
            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 rounded-md bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-700 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={copied
              ? "Copied"
              : "Copy code"}
          >
            {copied
              ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )
              : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 16c0 1.886 0 2.828.586 3.414C9.172 20 10.114 20 12 20h4c1.886 0 2.828 0 3.414-.586C20 18.828 20 17.886 20 16v-4c0-1.886 0-2.828-.586-3.414C18.828 8 17.886 8 16 8m-8 8h4c1.886 0 2.828 0 3.414-.586C16 14.828 16 13.886 16 12V8m-8 8c-1.886 0-2.828 0-3.414-.586C4 14.828 4 13.886 4 12V8c0-1.886 0-2.828.586-3.414C5.172 4 6.114 4 8 4h4c1.886 0 2.828 0 3.414.586C16 5.172 16 6.114 16 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
          </button>
        </div>
        {isClient
          ? (
            <code
              className={`language-${language} text-gray-800`}
              dangerouslySetInnerHTML={{
                __html: highlightedCode,
              }}
            />
          )
          : (
            <code className={`language-${language} text-gray-800`}>{code}</code>
          )}
      </pre>
    </div>
  );
}
