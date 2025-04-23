"use client";

import { useGlobalConnect } from "./GlobalConnectProvider";
import CodeBlock from "./CodeBlock";

export default function DemoClientCode() {
  const { getClientCodeSnippet } = useGlobalConnect();
  
  return (
    <CodeBlock code={getClientCodeSnippet()} language="javascript" />
  );
}