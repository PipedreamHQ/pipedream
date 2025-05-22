import { ConfigurableProps } from "@pipedream/sdk";

export const componentAppKey = (configuredProps: ConfigurableProps) => {
  return configuredProps.find((prop) => prop.type === "app")?.app;
};
