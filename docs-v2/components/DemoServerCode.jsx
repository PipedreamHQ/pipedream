"use client";

import { useConnectDemo } from './ConnectDemoContext';
import CodeBlock from './CodeBlock';

export default function DemoServerCode() {
  const { getServerCodeSnippet } = useConnectDemo();
  
  return (
    <CodeBlock code={getServerCodeSnippet()} language="javascript" />
  );
}