/* eslint-disable @typescript-eslint/ban-types */
export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue; };

export type SendPayload = any;
export interface SendConfigHTTPKv {
  [key: string]: string;
}
export interface SendConfigHTTPAuth {
  username: string;
  password: string;
}
export type UppercaseHTTPMethod =
  | "GET"
  | "HEAD"
  | "POST"
  | "PUT"
  | "DELETE"
  | "CONNECT"
  | "OPTIONS"
  | "TRACE"
  | "PATCH";
export interface SendConfigHTTP {
  method?: UppercaseHTTPMethod;
  url: string;
  headers?: SendConfigHTTPKv;
  params?: SendConfigHTTPKv;
  auth?: SendConfigHTTPAuth;
  data?: SendPayload;
}
export interface SendConfigS3 {
  bucket: string;
  prefix: string;
  payload: SendPayload;
}
export interface SendConfigEmail {
  subject: string;
  text?: string;
  html?: string;
}
export interface SendConfigEmit {
  raw_event: SendPayload;
}
export interface SendConfigSSE {
  channel: string;
  payload: SendPayload;
}
export interface SendFunctionsWrapper {
  http: (config: SendConfigHTTP) => void;
  email: (config: SendConfigEmail) => void;
  emit: (config: SendConfigEmit) => void;
  s3: (config: SendConfigS3) => void;
  sse: (config: SendConfigSSE) => void;
}

/**
 * Http Response.
 */
export interface HTTPResponse {
  /**
   * HTTP Status
   */
  status: number;
  /**
   * Http Body
   */
  body: string | Buffer | NodeJS.ReadableStream;
  /**
   * If true, issue the response when the promise returned is resolved, otherwise issue
   * the response at the end of the workflow execution
   */
  immediate?: boolean;
}

export interface Methods {
  [key: string]: (...args: any) => unknown;
}

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

// https://pipedream.com/docs/components/api/#async-options-example
export interface OptionsMethodArgs {
  page?: number;
  prevContext?; // XXX could be typed using context from OptionalOptsFn ReturnValue?
  [key: string]; // XXX properties in the return value of OptionalOptsFn can be included. Strictly type this instead?
}

// https://pipedream.com/docs/components/api/#referencing-values-from-previous-props
export interface OptionalOptsFn {
  (configuredProps: { [key: string]; }): object; // XXX strictly type configuredProps
}

export type PropDefinition = [App, string] | [App, string, OptionalOptsFn];

// https://pipedream.com/docs/components/api/#prop-definitions-example
export interface PropDefinitionReference {
  propDefinition: PropDefinition;
}

// https://pipedream.com/docs/components/api/#app-props
// See https://www.typescriptlang.org/docs/handbook/utility-types.html#thistypetype
// for more information on this technique
export interface App {
  type: "app";
  app: string;
  propDefinitions?: AppPropDefinitions | undefined;
  methods?: (Methods | undefined) & ThisType<any>;
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
export interface HttpAuth {
  type?: "basic" | "bearer" | "none";
  username?: string;
  password?: string;
  token?: string;
}
export interface HttpBody {
  type?: "fields" | "raw";
  contentType?: string;
  fields?: Field[];
  mode?: "fields" | "raw";
  raw?: string;
}
export interface DefaultHttpRequestPropConfig {
  auth?: HttpAuth;
  body?: HttpBody;
  headers?: Field[];
  params?: Field[];
  tab?: string;
  method?: string;
  url?: string;
}

export interface BasePropInterface {
  label?: string;
  description?: string;
}

export type PropOptions = any[] | Array<{ [key: string]: string; }>;

// https://pipedream.com/docs/components/api/#user-input-props
export interface UserProp extends BasePropInterface {
  type: "boolean" | "boolean[]" | "integer" | "integer[]" | "string" | "string[]" | "object" | "any";
  options?: PropOptions | ((this: any, opts: OptionsMethodArgs) => Promise<PropOptions>);
  optional?: boolean;
  default?: JSONValue;
  secret?: boolean;
  min?: number;
  max?: number;
}

// https://pipedream.com/docs/components/api/#interface-props
export interface InterfaceProp extends BasePropInterface {
  type: "$.interface.http" | "$.interface.timer";
  default?: string | DefaultConfig;
}

// https://pipedream.com/docs/components/api/#db
export interface ServiceDBProp extends BasePropInterface {
  type: "$.service.db";
}

// https://pipedream.com/docs/code/nodejs/using-data-stores/#using-the-data-store
export interface DataStoreProp extends BasePropInterface {
  type: "data_store";
}

export interface HttpRequestProp extends BasePropInterface {
  type: "http_request";
  default?: DefaultHttpRequestPropConfig;
}

export interface SourcePropDefinitions {
  [name: string]: PropDefinitionReference |
    App | UserProp | InterfaceProp | ServiceDBProp | HttpRequestProp;
}

export interface ActionPropDefinitions {
  [name: string]: PropDefinitionReference | App | UserProp | DataStoreProp | HttpRequestProp;
}

export interface AppPropDefinitions {
  [name: string]: PropDefinitionReference | App | UserProp;
}

export interface Hooks {
  deploy?: (this: any) => Promise<void>;
  activate?: (this: any) => Promise<void>;
  deactivate?: (this: any) => Promise<void>;
}

export interface SourceRunOptions {
  event: JSONValue;
}

export interface ActionRunOptions {
  $: Pipedream;
}

// https://pipedream.com/docs/components/api/#run
export interface EmitMetadata {
  id?: string | number;
  name?: string;
  summary?: string;
  ts: number;
}
export interface EmitConfig {
  event: JSONValue;
  metadata?: EmitMetadata;
}

export interface Source {
  key: string;
  name?: string;
  description?: string;
  version: string;
  type: "source";
  // XXX should be something like methods?: Methods & ThisType<PropKeys<SourcePropDefinitions> & Methods>
  methods?: Methods & ThisType<any>;
  hooks?: Hooks & ThisType<any>;
  props?: SourcePropDefinitions;
  dedupe?: "last" | "greatest" | "unique";
  additionalProps?: (
    previousPropDefs: SourcePropDefinitions
  ) => Promise<SourcePropDefinitions>;
  // XXX `this` should be strictly typed. For some reason the approach I took above
  // did not work here.
  run: (this: any, options?: SourceRunOptions) => void | Promise<void>;
}

export interface Action {
  key: string;
  name?: string;
  description?: string;
  version: string;
  type: "action";
  methods?: Methods & ThisType<any>;
  props?: ActionPropDefinitions & ThisType<any>;
  additionalProps?: (
    previousPropDefs: ActionPropDefinitions
  ) => Promise<ActionPropDefinitions>;
  // XXX `this` should be strictly typed. For some reason the approach I took above
  // did not work here.
  run: (this: any, options?: ActionRunOptions) => any;
}
