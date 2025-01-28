import type { ConfigurablePropAlert } from "@pipedream/sdk";

type AlertProps = {
  prop: ConfigurablePropAlert;
};

export function Alert({ prop }: AlertProps) {
  // XXX useCustomize, getClassNames
  return <p className={`pd-alert-${prop.alertType}`}>{prop.content}</p>;
}
