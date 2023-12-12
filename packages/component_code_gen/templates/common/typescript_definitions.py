typescript_definitions = """## TypeScript Definitions

export interface Methods {
  [key: string]: (...args: any) => unknown;
}

// $.flow.exit() and $.flow.delay()
export interface FlowFunctions {
  exit: (reason: string) => void;
  delay: (ms: number) => {
    resume_url: string;
    cancel_url: string;
  };
}

export interface Pipedream {
  export: (key: string, value: JSONValue) => void;
  send: SendFunctionsWrapper;
  /**
   * Respond to an HTTP interface.
   * @param response Define the status and body of the request.
   * @returns A promise that is fulfilled when the body is read or an immediate response is issued
   */
  respond: (response: HTTPResponse) => Promise<any> | void;
  flow: FlowFunctions;
}

// Arguments to the options method for props
export interface OptionsMethodArgs {
  page?: number;
  prevContext?: any;
  [key: string]: any;
}

// You can reference the values of previously-configured props!
export interface OptionalOptsFn {
  (configuredProps: { [key: string]: any; }): object;
}

export type PropDefinition =
  [App<Methods, AppPropDefinitions>, string] |
  [App<Methods, AppPropDefinitions>, string, OptionalOptsFn];

// You can reference props defined in app methods, referencing the propDefintion directly in props
export interface PropDefinitionReference {
  propDefinition: PropDefinition;
}

export interface App<
  Methods,
  AppPropDefinitions
> {
  type: "app";
  app: string;
  propDefinitions?: AppPropDefinitions;
  methods?: Methods & ThisType<Methods & AppPropDefinitions>;
}

export function defineApp<
  Methods,
  AppPropDefinitions,
>
(app: App<Methods, AppPropDefinitions>): App<Methods, AppPropDefinitions> {
  return app;
}

// Props

export interface DefaultConfig {
  intervalSeconds?: number;
  cron?: string;
}

export interface Field {
  name: string;
  value: string;
}

export interface BasePropInterface {
  label?: string;
  description?: string;
}

export type PropOptions = any[] | Array<{ [key: string]: string; }>;

export interface UserProp extends BasePropInterface {
  type: "boolean" | "boolean[]" | "integer" | "integer[]" | "string" | "string[]" | "object" | "any";
  options?: PropOptions | ((this: any, opts: OptionsMethodArgs) => Promise<PropOptions>);
  optional?: boolean;
  default?: JSONValue;
  secret?: boolean;
  min?: number;
  max?: number;
}

export interface InterfaceProp extends BasePropInterface {
  type: "$.interface.http" | "$.interface.timer";
  default?: string | DefaultConfig;
}

// When users ask about data stores, remember to include a prop of type "data_store" in the props object
export interface DataStoreProp extends BasePropInterface {
  type: "data_store";
}

export interface HttpRequestProp extends BasePropInterface {
  type: "http_request";
  default?: DefaultHttpRequestPropConfig;
}

export interface ActionPropDefinitions {
  [name: string]: PropDefinitionReference | App<Methods, AppPropDefinitions> | UserProp | DataStoreProp | HttpRequestProp;
}

export interface AppPropDefinitions {
  [name: string]: PropDefinitionReference | App<Methods, AppPropDefinitions> | UserProp;
}

export interface ActionRunOptions {
  $: Pipedream;
  steps: JSONValue;
}

type PropThis<Props> = {
  [Prop in keyof Props]: Props[Prop] extends App<Methods, AppPropDefinitions> ? any : any
};

export interface Action<
  Methods,
  ActionPropDefinitions
> {
  key: string;
  name?: string;
  description?: string;
  version: string;
  type: "action";
  methods?: Methods & ThisType<PropThis<ActionPropDefinitions> & Methods>;
  props?: ActionPropDefinitions;
  additionalProps?: (
    previousPropDefs: ActionPropDefinitions
  ) => Promise<ActionPropDefinitions>;
  run: (this: PropThis<ActionPropDefinitions> & Methods, options?: ActionRunOptions) => any;
}

export function defineAction<
  Methods,
  ActionPropDefinitions,
>
(component: Action<Methods, ActionPropDefinitions>): Action<Methods, ActionPropDefinitions> {
  return component;
}
"""
