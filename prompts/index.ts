export const componentMaker = (prompt, appData) => {
  // If an app was provided, use it to generate the component
  if (appData && Object.keys(appData).length > 0) {
    const {
      name: app, name_slug, auth_type, description, custom_fields_json,
    } = appData;

    let authText = `Within the run method, this exposes the user's ${app} credentials in the object \`this.${name_slug}.$auth\`. For integrations where users provide static API keys / tokens, the $auth object contains properties for each key / token the user enters. For OAuth integrations, this object exposes the OAuth access token in the oauth_access_token property of the $auth object. `;
    if (auth_type === "keys") {
      const customFields = JSON.parse(custom_fields_json);
      const customFieldsText = customFields.map((o) => o["name"]).join(", ");
      authText += `${app} is a key-based app. For integrations where users provide static API keys / tokens, \`this.${name_slug}.$auth\` contains properties for each key / token the user enters. Users are asked to enter the following custom fields: ${customFieldsText}. These are each exposed as properties in the object \`this.${name_slug}.$auth\`. When you make the API request, use the format from the ${app} docs. Different apps pass credentials in different places in the HTTP request, e.g. headers, url params, etc. Consult the docs`;
    } else if (auth_type === "oauth") {
      authText += `${app} is an OAuth app. For OAuth integrations, this object exposes the OAuth access token in the variable \`this.${name_slug}.$auth.oauth_access_token\`. When you make the API request, make sure to use the format from the ${app} docs, e.g. you may need to pass the OAuth access token as a Bearer token in the Authorization header. Consult the docs`;
    }
    return `${prompt}.
      
language: Node.js v14.
output: Node.js code
      
You should output Pipedream component code. Here's the TypeScript type definitions:

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
}

// https://pipedream.com/docs/components/api/#timer
export type SourceTimerRunOptions = {
  timestamp: number;
  interval_seconds: number;
}

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
  ts: number;
}

type EmitFunction = {
  $emit: (event: JSONValue, metadata: EmitMetadata) => Promise<void>;
};

type PropThis<Props> = {
  [Prop in keyof Props]: Props[Prop] extends App<Methods, AppPropDefinitions> ? any : any
};

export interface Source<
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

First, I need to teach you what a Pipedream component is. All Pipedream components are Node.js modules that have a default export: \`defineComponent\`. \`defineComponent\` is provided to the environment as a global — you do not need to import \`defineComponent\`. \`defineComponent\` is a function that takes an object — a Pipedream component — as its single argument. The object contains a \`props\` property, which defines a single prop of type "app". This lets the user connect their ${app} account to the step, authorizing requests to the ${app} API (${description}). ${authText}. Don't reference the \`steps\` and \`\$\` variables passed to the \`run\` method.

Use the \`axios\` constructor from the \`@pipedream/platform\` package to make the API request. Make sure to include the following import at the top of your Node.js code, above the component:

import { axios } from "@pipedream/platform";

Here's an example Pipedream component that makes a test request against the Slack API:

import \{ axios \} from "@pipedream/platform";

export default defineComponent(\{
  props: \{
    slack: \{
      type: "app",
      app: "slack",
    \},
    channel: \{
      type: "string",
      label: "Channel",
      description: "The channel to post the message to",
    \},
    text: \{
      type: "string",
      label: "Message Text",
      description: "The text of the message to post",
    \},
  \},
  async run(\{ steps, \$ \}) \{
    return await axios(\$, \{
      method: "POST",
      url: \`https://slack.com/api/chat.postMessage\`,
      headers: \{
        Authorization: \`Bearer \$\{this.slack.\$auth.oauth_access_token\}\`,
      \},
      data: \{
        channel: this.channel,
        text: this.text,
      \},
    \});
  \},
\});

The code you generate should be placed within the \`run\` method of the Pipedream component. Use this format:

import \{ axios \} from "@pipedream/platform";

export default defineComponent(\{
  props: \{
    ${name_slug}: \{
      type: "app",
      app: "${name_slug}",
    \},
  \},
  async run(\{ steps, \$ \}) \{
    return await axios(\$, \{
      // Add the proper axios configuration object to make the HTTP request here
    \});
  \},
\});

Use ESM for all imports, not CommonJS.

Make sure to include all required headers and parameters in the API request. Please pass literal values as the values of all required params. Use the proper types of values, e.g. "test" for strings and true for booleans. Do not reference \`steps\`, \`\$\`, \`this\`, or any other variable in the scope of the \`run\` method.

Include any required parameters as properties of the \`props\` object, alongside the ${name_slug} app prop. Props can include a human-readable \`label\`, a \`type\` (one of string|boolean|integer|object) that corresponds to the Node.js type of the required param, and a human-readable \`description\` describing the param. string and object props allow for arrays of input, and the array types are "string[]" and "object[]" respectively. The value of these props will be exposed on the \`this\` object, as a property corresponding to the name property under the \`props\` object, e.g. \`this.prop\`.

Make sure to use the correct HTTP method in the \`axios\` request, comparing this to other examples you've been trained on.

Double-check the code against known Node.js examples you've been trained on, both from ${app} examples, GitHub, and any other real code you find.

Only return Node.js code. DO NOT include any English text before or after the Node.js code. DO NOT say something like "Here's an example..." to preface the code. DO NOT include the code in Markdown code blocks, or format it in any fancy way. Just show me the code.

---

`;
  }

  // Query when an app isn't provided (general code)
  return `${prompt}.

language: Node.js v14.
output: Node.js code

The code should be Node.js, and should be formatted as a Pipedream component. Here are the TypeScript type definitions:

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
}

// https://pipedream.com/docs/components/api/#timer
export type SourceTimerRunOptions = {
  timestamp: number;
  interval_seconds: number;
}

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
  ts: number;
}

type EmitFunction = {
  $emit: (event: JSONValue, metadata: EmitMetadata) => Promise<void>;
};

type PropThis<Props> = {
  [Prop in keyof Props]: Props[Prop] extends App<Methods, AppPropDefinitions> ? any : any
};

export interface Source<
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

First, I need to teach you what a Pipedream component is. All Pipedream components are Node.js modules that have a default export: \`defineComponent\`. \`defineComponent\` is provided to the environment as a global — you do not need to import \`defineComponent\`. \`defineComponent\` is a function that takes an object — a Pipedream component — as its single argument. 

Here's an example Pipedream component that makes a test request using axios:

import axios from "axios";

export default defineComponent(\{
  // Remember that props are not required. Use if the example requires human input.
  props: \{
    url: \{
      type: "string",
      label: "URL to make request to",
    \},
    test: \{
      type: "string",
      label: "Test Prop",
    \},
  \},
  async run(\{ steps, \$ \}) \{
    // Your code should be placed here
    // Example code — returns the value of the input prop to the user
    const upper = this.test.toUpperCase()
    return await axios({
      method: "GET",
      url: this.url,
      params: {
        test: this.test
      }
    })
  \},
\});

The object _may_ contain an optional a \`props\` property, which in this example defines an example string prop. The props object is not required. Include it only if the function / method in the example requires input. Props lets the user pass data to the step via a form in the Pipedream UI, so they can fill in the values of the variables. Include any required parameters as properties of the \`props\` object. Props must include a human-readable \`label\` and a \`type\` (one of string|boolean|integer|object) that corresponds to the Node.js type of the required param. string and object props allow for arrays of input, and the array types are "string[]" and "object[]" respectively. Optionally, props can have a human-readable \`description\` describing the param. Optional parameters that correspond to the test code should be declared with \`optional: true\`.

Within the run method, the \`this\` variable refers to the component code. All props are exposed at \`this.<name of the key in the props object>\`. e.g. \`this.input\` in the example above.

Don't reference the \`steps\` and \`\$\` variables passed to the \`run\` method within the \`run\` method, but include it in the signature. Consider the \`steps\` and \`\$\` variables undefined for this example code, unless the prompt asks you to use the \`steps\` object or functions on the \$.

imports should be placed at the top of the file. Use ESM for all imports, not CommonJS. DO NOT use the \`import axios from "axios"\` import from the example above in the example you produce, unless the example requires making an HTTP request with \`axios\`. That's just an example to show you where imports for the package should be placed.

If the code requires you make an HTTP request, use \`axios\` to make the request.

The example code should be placed within the \`run\` method of the Pipedream component.

Double-check the code against known Node.js examples you've been trained on, e.g. from GitHub and any other real code you find.

\`return\` the final value from the step. The data returned from steps must be JSON-serializable. The returned data is displayed in the Pipedream execution logs below the step when the user runs the code.

Only return Node.js code. DO NOT include any English text before or after the Node.js code. DO NOT say something like "Here's an example..." to preface the code. DO NOT include the code in Markdown code blocks, or format it in any fancy way. Just show me the code.

---

`;
};
