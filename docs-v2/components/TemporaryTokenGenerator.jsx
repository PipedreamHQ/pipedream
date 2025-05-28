"use client";

import { useState } from "react";
import { styles } from "../utils/componentStyles";

export default function TemporaryTokenGenerator() {
  const [
    token,
    setToken,
  ] = useState("");
  const [
    copied,
    setCopied,
  ] = useState(false);

  // Generate a UUID v4
  function generateUUID() {
    return crypto.randomUUID();
  }

  function generateToken() {
    const uuid = generateUUID();
    const newToken = `devtok_${uuid}`;
    setToken(newToken);
    setCopied(false);
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        Generate a temporary access token
      </div>
      <div className="p-4">
        <div className="mb-4">
          <button
            onClick={generateToken}
            className={styles.primaryButton}
          >
            Generate token
          </button>
        </div>

        {token && (
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded pl-2 pr-4 py-2 border">
                <div className={styles.codeText}>{token}</div>
              </div>
              <button
                onClick={copyToClipboard}
                className={styles.secondaryButton}
              >
                {copied
                  ? (
                    <>
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    Copied!
                    </>
                  )
                  : (
                    <>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    Copy
                    </>
                  )}
              </button>
            </div>
            <div className={`mt-2 ${styles.text.muted}`}>
              This is a temporary token. Any linked connected accounts will be regularly deleted.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
