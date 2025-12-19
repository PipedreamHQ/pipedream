import { FormContext } from "../hooks/form-context";
import { FormFieldContext } from "../hooks/form-field-context";
import {
  ConfigurableProp,
  ConfigurableProps,
} from "@pipedream/sdk";
// import { ControlAny } from "./ControlAny"
import { ControlApp } from "./ControlApp";
import { ControlArray } from "./ControlArray";
import { ControlBoolean } from "./ControlBoolean";
import { ControlInput } from "./ControlInput";
import { ControlHttpRequest } from "./ControlHttpRequest";
import { ControlObject } from "./ControlObject";
import { ControlSelect } from "./ControlSelect";
import { ControlSql } from "./ControlSql";
import { RemoteOptionsContainer } from "./RemoteOptionsContainer";
import { sanitizeOption } from "../utils/type-guards";
import type { RawPropOption } from "../types";

export type ControlProps<T extends ConfigurableProps, U extends ConfigurableProp> = {
  field: FormFieldContext<U>;
  form: FormContext<T>;
};

// TODO for easier Control* overriding, should probably pass more stuff in so they don't need to reach into context?
// ... or do we want the API to incentivize just reaching into context?
export function Control<T extends ConfigurableProps, U extends ConfigurableProp>(props: ControlProps<T, U>) {
  const {
    field, form,
  } = props;
  const { queryDisabledIdx } = form;
  const {
    prop, idx,
  } = field;
  const app = "app" in field.extra
    ? field.extra.app
    : undefined;
  if (prop.remoteOptions || prop.type === "$.discord.channel" || prop.type === "$.discord.channel[]") {
    return <RemoteOptionsContainer queryEnabled={queryDisabledIdx == null || queryDisabledIdx >= idx} />;
  }

  if ("options" in prop && Array.isArray(prop.options) && prop.options.length > 0) {
    // Cast needed: SDK's prop.options union includes TimerInterval which doesn't match RawPropOption,
    // but sanitizeOption handles arbitrary objects safely (see type-guards.ts:118-158)
    const options = (prop.options as RawPropOption[]).map(sanitizeOption);
    return <ControlSelect options={options} components={{
      IndicatorSeparator: () => null,
    }} />;
  }

  // TODO just look at registry component repo and look for what we should make sure we support
  // TODO deal with suspense stuff!
  if (prop.type.endsWith("[][]")) {
    throw new Error("Unsupported property type: " + prop.type);
  }

  if (prop.type.endsWith("[]")) {
    // If no options are defined, use individual inputs with "Add more" functionality
    if (!("options" in prop) || !prop.options) {
      return <ControlArray />;
    }
    // If options are defined, they would have been handled above in the options check
    return <ControlSelect isCreatable={true} options={[]} components={{
      IndicatorSeparator: () => null,
    }} />;
  }

  switch (prop.type) {
  // problem with this is that it should be the JSON value, but if it is at any point
  // not a valid json value, it should just be the string so the value is not lost... so it's just very odd
  // without a more stringent JSON builder type component
  // case "any":
  //   return <ControlAny />
  case "app":
    return <ControlApp app={app!} />;
  case "boolean":
    return <ControlBoolean />;
  case "string":
  case "integer":
    // XXX split into ControlString, ControlInteger, etc? but want to share autoComplet="off", etc functionality in base one
    return <ControlInput />;
  case "object":
    return <ControlObject />;
  case "sql":
    return <ControlSql />;
  case "http_request":
    return <ControlHttpRequest />;
  default:
    // TODO "not supported prop type should bubble up"
    throw new Error("Unsupported property type: " + prop.type);
  }
}
