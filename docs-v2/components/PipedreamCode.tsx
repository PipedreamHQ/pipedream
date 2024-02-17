import React from 'react';
import { Fira_Code } from 'next/font/google'

interface PipedreamCodeProps {
  children: React.ReactNode;
}

const fira = Fira_Code({
  weight: '400',
  subsets: ['latin'],
})

export default ({ children }: PipedreamCodeProps) => {
  return (
    <code className={`${fira.className} dark:text-white`}>{children}</code> 
  );
}