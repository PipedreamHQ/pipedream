"use client";

import { useGlobalConnect } from "./GlobalConnectProvider";
import CodeBlock from "./CodeBlock";

export default function DemoServerCode() {
  const { getServerCodeSnippet } = useGlobalConnect();
  
  return (
    <CodeBlock code={getServerCodeSnippet()} language="javascript" />
  );
}