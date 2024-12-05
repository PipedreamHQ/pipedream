import React from "react";
import { Fira_Code } from "next/font/google";

interface PipedreamCodeProps {
  children: React.ReactNode;
}

const fira = Fira_Code({
  weight: [
    "400",
    "600",
  ],
  subsets: [
    "latin",
  ],
});

const PipedreamCode = ({ children }: PipedreamCodeProps) => <>
  <code className={`${fira.className} dark:text-white p-2`}>{children}</code>
</>;

export default PipedreamCode;
