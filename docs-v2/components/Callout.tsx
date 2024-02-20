import React from "react";
import { Callout } from "nextra/components";

interface CalloutProps {
  type?: "default" | "info" | "warning" | "error";
  emoji?: string | React.ReactNode;
  children: React.ReactNode;
}

const PipedreamCallout: React.FC<CalloutProps> = ({
  type,
  emoji,
  children,
}) => {
  return (
    <Callout type={type} emoji={emoji}>
      <div>{children}</div>
    </Callout>
  );
};

export default PipedreamCallout;
