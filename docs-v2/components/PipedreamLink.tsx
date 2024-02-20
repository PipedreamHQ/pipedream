import React from "react";
import Link from "next/link";

interface PipedreamLinkProps {
  href: string;
  children: React.ReactNode;
}

const PipedreamLink = ({
  href, children,
}: PipedreamLinkProps) => {
  return (
    <Link className="underline underline-offset-4 hover:decoration-2 font-medium decoration-brand/50 text-black dark:text-white" href={href}>{children}</Link>
  );
};

export default PipedreamLink;
