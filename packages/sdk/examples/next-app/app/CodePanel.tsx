import React, { useEffect, useState } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-okaidia.css";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-bash";

interface CodePanelProps {
  code: string;
  language: string;
}

const CodePanel = ({ code, language }: CodePanelProps) => {
  const [highlightedCode, setHighlightedCode] = useState("");

  useEffect(() => {
    const highlighted = Prism.highlight(
      code,
      Prism.languages.typescript,
      language,
    );
    const lines = highlighted.split("\n").map(
      (line, index) =>
        `<div class="flex">
        <span class="w-12 text-right text-gray-600 select-none pr-4 flex-none">${index + 1}</span>
        <span class="lg:whitespace-pre-wrap flex-auto">${line}</span>
      </div>`,
    );
    setHighlightedCode(lines.join(""));
  }, [code, language]);

  return (
    <div className="relative pt-4 bg-gray-800 text-white font-mono text-sm rounded-md max-w-full shadow-lg pr-4">
      <div className="absolute top-0 left-0 right-0 p-2 flex items-center bg-gray-900 rounded-md">
        <div className="flex space-x-2 ml-2 my-1">
          <span className="block w-3 h-3 bg-red-500 rounded-full"></span>
          <span className="block w-3 h-3 bg-yellow-400 rounded-full"></span>
          <span className="block w-3 h-3 bg-green-500 rounded-full"></span>
        </div>
      </div>
      <div className="pt-6 mt-2 overflow-x-auto">
        <pre>
          <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
          <br />
        </pre>
      </div>
    </div>
  );
};

export default CodePanel;
