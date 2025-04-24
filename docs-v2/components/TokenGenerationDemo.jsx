"use client";

import { useGlobalConnect } from "./GlobalConnectProvider";
import CodeBlock from "./CodeBlock";
import { styles } from "../utils/componentStyles";

export default function TokenGenerationDemo() {
  const {
    externalUserId,
    getServerCodeSnippet,
    generateToken,
    tokenLoading,
    tokenData,
  } = useGlobalConnect();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        Generate a Connect Token from your server
      </div>
      <div className="p-4">
        <div className="mb-3">
          <div className="flex items-center mb-4">
            <span className={styles.label}>External User ID:</span>
            <code className={`ml-2 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm ${styles.text.strong}`}>{externalUserId}</code>
          </div>
          <div className="mb-4">
            <div className="border border-blue-100 rounded-lg overflow-hidden">
              <CodeBlock code={getServerCodeSnippet()} language="javascript" />
            </div>
          </div>
        </div>

        <div className="mt-4 mb-2">
          <button
            onClick={generateToken}
            disabled={tokenLoading}
            className={styles.primaryButton}
          >
            {tokenLoading
              ? "Generating..."
              : "Generate Token"}
          </button>
        </div>

        {tokenData && (
          <div className="mt-4">
            <div className={`text-sm mb-2 font-medium ${styles.text.strong}`}>Response:</div>
            <div className="border border-green-200 rounded-lg overflow-hidden">
              <CodeBlock
                code={JSON.stringify(tokenData, null, 2)}
                language="json"
                className="max-h-48 overflow-auto"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
