import {
  Readable, Writable,
} from "stream";

/* eslint-disable @typescript-eslint/no-explicit-any */
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
  body: string | Buffer | Readable;
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
  delay: (ms: number, context: object) => {
    resume_url: string;
    cancel_url: string;
  };
  rerun: (ms: number, context: object) => {
    resume_url: string;
    cancel_url: string;
  };
  suspend: (ms: number, context: object) => {
    resume_url: string;
    cancel_url: string;
  };
  refreshTimeout: () => string;
}

export interface IApi {
  open(path: string): IFile;
  openDescriptor(descriptor: any): IFile;
  dir(path?: string): AsyncGenerator<{
    isDirectory: () => boolean;
    isFile: () => boolean;
    path: string;
    name: string;
    size?: number;
    modifiedAt?: Date;
    file?: IFile;
  }>;
}

export interface IFile {
  delete(): Promise<void>;
  createReadStream(): Promise<Readable>;
  createWriteStream(contentType?: string, contentLength?: number): Promise<Writable>;
  toEncodedString(encoding?: string, start?: number, end?: number): Promise<string>;
  toUrl(): Promise<string>;
  toFile(localFilePath: string): Promise<void>;
  toBuffer(): Promise<Buffer>;
  fromReadableStream(readableStream: Readable, contentType?: string, contentSize?: number): Promise<IFile>;
  fromFile(localFilePath: string, contentType?: string): Promise<IFile>;
  fromUrl(url: string, options?: any): Promise<IFile>;
  toJSON(): any;
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
  files: IApi;
}

// https://pipedream.com/docs/components/api/#async-options-example
export interface OptionsMethodArgs {
  page?: number;
  prevContext?: any; // XXX could be typed using context from OptionalOptsFn ReturnValue?
  [key: string]: any; // XXX properties in the return value of OptionalOptsFn can be included. Strictly type this instead?
}

// https://pipedream.com/docs/components/api/#referencing-values-from-previous-props
export interface OptionalOptsFn {
  (configuredProps: { [key: string]: any; }): object; // XXX strictly type configuredProps
}

export type PropDefinition =
  [App<Methods, AppPropDefinitions>, string] |
  [App<Methods, AppPropDefinitions>, string, OptionalOptsFn];

// https://pipedream.com/docs/components/api/#prop-definitions-example
export interface PropDefinitionReference {
  propDefinition: PropDefinition;
}

// https://pipedream.com/docs/components/api/#app-props
// See https://www.typescriptlang.org/docs/handbook/utility-types.html#thistypetype
// for more information on this technique
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
  disabled?: boolean;
  hidden?: boolean;
  reloadProps?: boolean;
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
  [name: string]: PropDefinitionReference | App<Methods, AppPropDefinitions> | UserProp | InterfaceProp | ServiceDBProp | HttpRequestProp;
}

export interface ActionPropDefinitions {
  [name: string]: PropDefinitionReference | App<Methods, AppPropDefinitions> | UserProp | DataStoreProp | HttpRequestProp;
}

export interface AppPropDefinitions {
  [name: string]: PropDefinitionReference | App<Methods, AppPropDefinitions> | UserProp;
}

export interface Hooks {
  deploy?: () => Promise<void>;
  activate?: () => Promise<void>;
  deactivate?: () => Promise<void>;
}

// https://pipedream.com/docs/components/api/#http-event-shape
export type SourceHttpRunOptions = {
  method: string;
  path: string;
  query: {
    [key: string]: string;
  };
  headers: {
    [key: string]: string;
  };
  bodyRaw?: string;
  body?: {
    [key: string]: JSONValue;
  };
};

// https://pipedream.com/docs/components/api/#timer
export type SourceTimerRunOptions = {
  timestamp: number;
  interval_seconds: number;
};

export type SourceRunOptions = SourceHttpRunOptions | SourceTimerRunOptions;

export interface ActionRunOptions {
  $: Pipedream;
  steps: JSONValue;
}

// https://pipedream.com/docs/components/api/#run
export interface EmitMetadata {
  id?: string | number;
  name?: string;
  summary?: string;
  ts?: number;
}

export interface IdEmitMetadata extends EmitMetadata {
  id: string | number;
}

type EmitFunction = {
  $emit: (event: JSONValue, metadata?: EmitMetadata) => Promise<void>;
};

type IdEmitFunction = {
  $emit: (event: JSONValue, metadata: IdEmitMetadata) => Promise<void>;
};

type PropThis<Props> = {
  [Prop in keyof Props]: Props[Prop] extends App<Methods, AppPropDefinitions> ? any : any
};

interface BaseSource<
  Methods,
  SourcePropDefinitions
> {
  key: string;
  name?: string;
  description?: string;
  version: string;
  type: "source";
  methods?: Methods & ThisType<PropThis<SourcePropDefinitions> & Methods & EmitFunction>;
  hooks?: Hooks & ThisType<PropThis<SourcePropDefinitions> & Methods & EmitFunction>;
  props?: SourcePropDefinitions;
  dedupe?: "last" | "greatest" | "unique";
  additionalProps?: (
    previousPropDefs: SourcePropDefinitions
  ) => Promise<SourcePropDefinitions>;
  run: (this: PropThis<SourcePropDefinitions> & Methods & EmitFunction, options?: SourceRunOptions) => void | Promise<void>;
}

export interface DedupedSource<Methods, SourcePropDefinitions>
  extends BaseSource<Methods, SourcePropDefinitions> {
  dedupe: "last" | "greatest" | "unique";
  run: (
    this: PropThis<SourcePropDefinitions> & Methods & IdEmitFunction,
    options?: SourceRunOptions
  ) => void | Promise<void>;
}

export interface NonDedupedSource<Methods, SourcePropDefinitions>
  extends BaseSource<Methods, SourcePropDefinitions> {
  dedupe?: never;
}

export type Source<Methods, SourcePropDefinitions> =
  | DedupedSource<Methods, SourcePropDefinitions>
  | NonDedupedSource<Methods, SourcePropDefinitions>;

export function defineSource<
  Methods,
  SourcePropDefinitions,
>
(component: Source<Methods, SourcePropDefinitions>): Source<Methods, SourcePropDefinitions> {
  return component;
}

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
  annotations?: {
    destructiveHint?: boolean;
    idempotentHint?: boolean;
    openWorldHint?: boolean;
    readOnlyHint?: boolean;
  }
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
