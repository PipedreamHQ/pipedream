// eslint-disable @typescript-eslint/no-explicit-any
type BaseConfigurableProp = {
  /**
   * When building `configuredProps`, make sure to use this field as the key when
   * setting the prop value.
   */
  name: string;
  type: string;

  // XXX don't actually apply to all, fix

  /**
   * Value to use as an input label. In cases where `type` is "app", should load
   * the app via `getApp`, etc. and show `app.name` instead.
   */
  label?: string;

  description?: string;
  optional?: boolean;
  disabled?: boolean;

  /**
   * If true, should not expose this prop to the user.
   */
  hidden?: boolean;

  /**
   * If true, call `configureComponent` for this prop to load remote options.
   * It is safe, and preferred, given a returned list of
   * { label: string; value: any } objects to set the prop
   * value to { __lv: { label: string; value: any } }. This way, on load, you
   * can access label for the value without necessarily reloading these options.
   */
  remoteOptions?: boolean;

  /**
   * If true, calls to `configureComponent` for this prop support receiving a
   * `query` parameter to filter remote options.
   */
  useQuery?: boolean;

  /**
   * If true, after setting a value for this prop, a call to `reloadComponentProps` is
   * required as the component has dynamic configurable props dependent on this
   * one.
   */
  reloadProps?: boolean;

  /**
   * If true, you must save the configured prop value as a "label-value" object
   * which should look like: { __lv: { label: string; value: any } }
   * because the execution needs to access the label.
   */
  withLabel?: boolean;
};

// XXX fix duplicating mapping to value type here and with PropValue

type LabelValueOption<T> = {
  label: string;
  value: T;
};

type Defaultable<T, SingleT = T> = {
  default?: T;
  options?: SingleT[] | Array<LabelValueOption<SingleT>>;
}

export type ConfigurablePropAlert = BaseConfigurableProp & {
  type: "alert";
  alertType?: "info" | "neutral" | "warning" | "error"; // TODO check the types
  content: string;
};

export type ConfigurablePropAny = BaseConfigurableProp & {
  type: "any";
} & Defaultable<any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export type ConfigurablePropApp = BaseConfigurableProp & {
  type: "app";
  app: string;
};

export type ConfigurablePropBoolean = BaseConfigurableProp & {
  type: "boolean";
} & Defaultable<boolean>;

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
} & Defaultable<string[], string>;

export type TimerInterval = {
  intervalSeconds: number;
}

export type TimerCron = {
  cron: string;
}

export type ConfigurablePropTimer = BaseConfigurableProp & {
  type: "$.interface.timer";
  static?: TimerInterval | TimerCron;
} & Defaultable<TimerInterval | TimerCron>;

export type ConfigurablePropApphook = BaseConfigurableProp & {
  type: "$.interface.apphook";
  appProp: string;
  eventNames?: Array<string>;
  remote?: boolean;
  static?: Array<unknown>;
}

export type ConfigurablePropIntegerArray = BaseConfigurableProp & {
  type: "integer[]";
  min?: number;
  max?: number;
} & Defaultable<number[], number>

export type ConfigurablePropHttp = BaseConfigurableProp & {
  type: "$.interface.http";
  customResponse?: boolean;
}

export type ConfigurablePropDb = BaseConfigurableProp & {
  type: "$.service.db";
}

export type ConfigurablePropSql = BaseConfigurableProp & {
  type: "sql";
  auth?: {
    app: string;
  };
} & Defaultable<string>;

export type ConfigurablePropHttpRequest = BaseConfigurableProp & {
  type: "http_request";
  default?: {
    url?: string;
    method?: string;
    headers?: Array<{ name: string; value: string }>;
    body?: {
      type?: "fields" | "raw";
      contentType?: string;
      raw?: string;
    };
  };
};

export type ConfigurablePropAirtableBaseId = BaseConfigurableProp & {
  type: "$.airtable.baseId";
  appProp: string;
}

export type ConfigurablePropAirtableTableId = BaseConfigurableProp & {
  type: "$.airtable.tableId";
  baseIdProp: string;
}

export type ConfigurablePropAirtableViewId = BaseConfigurableProp & {
  type: "$.airtable.viewId";
  tableIdProp: string;
}

export type ConfigurablePropAirtableFieldId = BaseConfigurableProp & {
  type: "$.airtable.fieldId";
  tableIdProp: string;
}

export type ConfigurablePropDiscordChannel = BaseConfigurableProp & {
  type: "$.discord.channel";
  appProp: string;
}

export type ConfigurablePropDiscordChannelArray = BaseConfigurableProp & {
  type: "$.discord.channel[]";
  appProp: string;
}

export type ConfigurableProp =
  | ConfigurablePropAirtableBaseId
  | ConfigurablePropAirtableFieldId
  | ConfigurablePropAirtableTableId
  | ConfigurablePropAirtableViewId
  | ConfigurablePropAlert
  | ConfigurablePropAny
  | ConfigurablePropApp
  | ConfigurablePropApphook
  | ConfigurablePropBoolean
  | ConfigurablePropDb
  | ConfigurablePropDiscordChannel
  | ConfigurablePropDiscordChannelArray
  | ConfigurablePropHttp
  | ConfigurablePropHttpRequest
  | ConfigurablePropInteger
  | ConfigurablePropIntegerArray
  | ConfigurablePropObject
  | ConfigurablePropSql
  | ConfigurablePropString
  | ConfigurablePropStringArray
  | ConfigurablePropTimer

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
  : T extends "sql"
  ? { app: string; query: string; params: unknown[]; }
  : T extends "http_request"
  ? {
      url?: string;
      method?: string;
      headers?: Array<{ name: string; value: string }>;
      body?: { type?: string; contentType?: string; raw?: string };
    }
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
  description?: string;
  component_type?: string;
  stash?: "optional" | "required";
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

  /**
   * The URL to the HTTP interface of this component, if it has one.
   */
  endpoint_url?: string;
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
