"use client";

import { useConnectSDK } from "./ConnectSDKContext";
import CodeBlock from "./CodeBlock";

export default function ClientCodeSnippet() {
  const { codeSnippets } = useConnectSDK();

  return (
    <CodeBlock code={codeSnippets.client} language="javascript" />
  );
}
