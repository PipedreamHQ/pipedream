// eslint-disable @typescript-eslint/no-explicit-any
type BaseConfigurableProp = {
  name: string;
  type: string;

  // XXX don't actually apply to all, fix
  label?: string;
  description?: string;
  optional?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  remoteOptions?: boolean;
  useQuery?: boolean;
  reloadProps?: boolean;
};

// XXX fix duplicating mapping to value type here and with PropValue
type Defaultable<T> = { default?: T; options?: T[]; };

export type ConfigurablePropAlert = BaseConfigurableProp & {
  type: "alert";
  alertType: "info" | "neutral" | "warning" | "error"; // TODO check the types
  content: string;
};
export type ConfigurablePropAny = BaseConfigurableProp & {
  type: "any";
} & Defaultable<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
export type ConfigurablePropApp = BaseConfigurableProp & {
  type: "app";
  app: string;
};
export type ConfigurablePropBoolean = BaseConfigurableProp & { type: "boolean"; };
export type ConfigurablePropInteger = BaseConfigurableProp & {
  type: "integer";
  min?: number;
  max?: number;
} & Defaultable<number>;
export type ConfigurablePropObject = BaseConfigurableProp & {
  type: "object";
} & Defaultable<object>;
export type ConfigurablePropString = BaseConfigurableProp & {
  type: "string";
  secret?: boolean;
} & Defaultable<string>;
export type ConfigurablePropStringArray = BaseConfigurableProp & {
  type: "string[]";
  secret?: boolean; // TODO is this supported
} & Defaultable<string[]>; // TODO
// | { type: "$.interface.http" } // source only
// | { type: "$.interface.timer" } // source only
// | { type: "$.service.db" }
// | { type: "data_store" }
// | { type: "http_request" }
// | { type: "sql" } -- not in component api docs!
export type ConfigurableProp =
  | ConfigurablePropAlert
  | ConfigurablePropAny
  | ConfigurablePropApp
  | ConfigurablePropBoolean
  | ConfigurablePropInteger
  | ConfigurablePropObject
  | ConfigurablePropString
  | ConfigurablePropStringArray
  | (BaseConfigurableProp & { type: "$.discord.channel"; });

export type ConfigurableProps = Readonly<ConfigurableProp[]>;

export type PropValue<T extends ConfigurableProp["type"]> = T extends "alert"
  ? never
  : T extends "any"
  ? any // eslint-disable-line @typescript-eslint/no-explicit-any
  : T extends "app"
  ? { authProvisionId: string; }
  : T extends "boolean"
  ? boolean
  : T extends "integer"
  ? number
  : T extends "object"
  ? object
  : T extends "string"
  ? string
  : T extends "string[]"
  ? string[] // XXX support arrays differently?
  : never;

export type ConfiguredProps<T extends ConfigurableProps> = {
  [K in T[number] as K["name"]]?: PropValue<K["type"]>
};

// as returned by API (configurable_props_json from `afterSave`)
export type V1Component<T extends ConfigurableProps = any> = { // eslint-disable-line @typescript-eslint/no-explicit-any
  name: string;
  key: string;
  version: string;
  configurable_props: T;
};

export type V1DeployedComponent<T extends ConfigurableProps = any> = { // eslint-disable-line @typescript-eslint/no-explicit-any
  id: string;
  owner_id: string;
  component_id: string;
  configurable_props: T;
  configured_props: ConfiguredProps<T>;
  active: boolean;
  created_at: number;
  updated_at: number;
  name: string;
  name_slug: string;
  callback_observations?: unknown;
};

export type V1EmittedEvent = {
  /**
   * The event's payload.
   */
  e: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

  /**
   * The event's type (set to "emit" currently).
   */
  k: string;

  /**
   * The event's timestamp in epoch milliseconds.
   */
  ts: number;

  /**
   * The event's unique ID.
   */
  id: string;
}
