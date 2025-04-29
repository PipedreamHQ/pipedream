"use client";

import { useGlobalConnect } from "./GlobalConnectProvider";
import CodeBlock from "./CodeBlock";
import { styles } from "../utils/componentStyles";

export default function AccountConnectionDemo() {
  const {
    appSlug,
    setAppSlug,
    tokenData,
    getClientCodeSnippet,
    connectAccount,
    connectedAccount,
    error,
  } = useGlobalConnect();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        Connect an account from your frontend
      </div>
      <div className="p-4">
        <div className="mb-4">
          <label className="flex items-center mb-4">
            <span className={styles.label}>App to connect:</span>
            <select
              value={appSlug}
              onChange={(e) => setAppSlug(e.target.value)}
              className={styles.select}
            >
              <option value="google_sheets">Google Sheets</option>
              <option value="github">GitHub</option>
              <option value="notion">Notion</option>
              <option value="gmail">Gmail</option>
              <option value="openai">OpenAI</option>
            </select>
          </label>

          <div className="mb-4">
            <div className="border border-blue-100 rounded-lg overflow-hidden">
              <CodeBlock code={getClientCodeSnippet()} language="javascript" />
            </div>
          </div>
        </div>

        <div className="mt-4 mb-2">
          <button
            onClick={connectAccount}
            disabled={!tokenData}
            className={styles.primaryButton}
          >
            Connect Account
          </button>
          {!tokenData && <p className={`mt-2 ${styles.text.muted}`}><a href="/docs/connect/managed-auth/quickstart/#generate-a-short-lived-token" className="font-semibold underline underline-offset-4 hover:decoration-2 decoration-brand/50">Generate a token above</a> in order to test the account connection flow</p>}
        </div>

        {error && (
          <div className={styles.statusBox.error}>
            <div className="font-medium text-sm">Error</div>
            <div className="mt-1 text-sm">{error}</div>
          </div>
        )}

        {connectedAccount && (
          <div className={`${styles.statusBox.success} p-4`}>
            <div className="font-medium text-sm">Successfully connected your {appSlug} account!</div>
            <div className="mt-4 text-sm">
              {connectedAccount.loading
                ? (
                  <div>Loading account details...</div>
                )
                : (
                  <>
                    {connectedAccount.name
                      ? (
                        <div>Account info: <span className="font-medium">{connectedAccount.name}</span></div>
                      )
                      : null}
                    <div>Account ID: <span className="font-medium">{connectedAccount.id}</span></div>
                  </>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
