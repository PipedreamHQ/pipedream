"use client";

import {
  useState,
  useEffect,
} from "react";
import { useGlobalConnect } from "./GlobalConnectProvider";

export default function ConnectLinkDemo() {
  const {
    tokenData,
    appSlug,
    setAppSlug,
  } = useGlobalConnect();
  const [
    connectLinkUrl,
    setConnectLinkUrl,
  ] = useState("");

  useEffect(() => {
    if (tokenData?.connect_link_url) {
      // Add app parameter to the URL if it doesn't already exist
      const baseUrl = tokenData.connect_link_url;
      const url = new URL(baseUrl);

      // Update or add the app parameter
      url.searchParams.set("app", appSlug);

      setConnectLinkUrl(url.toString());
    } else {
      setConnectLinkUrl("");
    }
  }, [
    tokenData,
    appSlug,
  ]);

  // No token data or connect_link_url - need to generate a token
  if (!tokenData?.connect_link_url) {
    return (
      <div className="border border-gray-200 rounded-md p-4 mt-4">
        <p className="text-sm text-gray-500">
          <a href="/docs/connect/managed-auth/quickstart/#generate-a-short-lived-token" className="font-semibold underline underline-offset-4 hover:decoration-2 decoration-brand/50">Generate a token above</a>
          {" "} to see a Connect Link URL here
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden mt-4">
      <div className="bg-gray-100 border-b px-4 py-2 font-medium text-sm">
        Connect Link URL
      </div>
      <div className="p-4">
        <div className="mb-4">
          <label className="flex items-center mb-4">
            <span className="font-medium text-sm">App to connect:</span>
            <select
              value={appSlug}
              onChange={(e) => setAppSlug(e.target.value)}
              className="ml-2 p-1 border rounded text-sm"
            >
              <option value="slack">Slack</option>
              <option value="github">GitHub</option>
              <option value="google_sheets">Google Sheets</option>
            </select>
          </label>

          <div className="mb-4">
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
              <code className="text-sm break-all">{connectLinkUrl}</code>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <a
            href={connectLinkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 font-medium text-sm inline-flex items-center"
          >
            Open Connect Link
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          <button
            onClick={() => {
              navigator.clipboard.writeText(connectLinkUrl);
            }}
            className="px-4 py-2 bg-gray-100 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium text-sm inline-flex items-center"
          >
            Copy URL
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p>
            This URL contains a Connect Token that expires in 4 hours
            <strong> or after it&apos;s used once</strong>.
            You can send this link to your users via email, SMS, or chat.
          </p>
          <p className="mt-2 text-xs text-gray-500">
            <strong>Note:</strong> Connect tokens are single-use. After a successful connection,
            you&apos;ll need to generate a new token.
          </p>
        </div>
      </div>
    </div>
  );
}
