"use client";

import { useConnectSDK } from "./ConnectSDKContext";
import CodeBlock from "./CodeBlock";

export default function ServerCodeSnippet() {
  const { codeSnippets } = useConnectSDK();

  return (
    <CodeBlock code={codeSnippets.server} language="javascript" />
  );
}
