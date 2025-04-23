"use client";

import { useConnectDemo } from "./ConnectDemoContext";
import CodeBlock from "./CodeBlock";

export default function DemoClientCode() {
  const { getClientCodeSnippet } = useConnectDemo();
  
  return (
    <CodeBlock code={getClientCodeSnippet()} language="javascript" />
  );
}