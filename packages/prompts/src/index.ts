interface AppData {
  name: string;
  name_slug: string;
  auth_type: string;
  description: string;
  custom_fields_json: string;
  component_code_scaffold_raw: string;
  test_request_json: string;
}

interface CustomFieldsJSON {
  name: string;
}

export const componentMaker = (appData: AppData) => {
  const typeDefs = `Here are TypeScript type definitions for Pipedream components:
  
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

// https://pipedream.com/docs/code/nodejs/using-data-stores/#using-the-data-store
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
}`;

  const asyncOptionsText = `The \`options\` method is an optional method that can be defined on a prop. It is used to dynamically generate the options for a prop and can return a static array of options or a Promise that resolves to an array of options.
  
Recall from the type definitions that the options method has the following signature:

options?: PropOptions | ((this: any, opts: OptionsMethodArgs) => Promise<PropOptions>);

PropOptions can return an array of strings, which will be used as both the value of the prop in the \`run\` method and the human-readable label of the option in the UI. PropOptions can also return an array of objects of the following format:

\`\`\`
[
  {
    label: "Human-readable option 1",
    value: "unique identifier 1",
  },
  {
    label: "Human-readable option 2",
    value: "unique identifier 2",
  },
]
\`\`\`

The \`label\` MUST BE a human-readable name of the option presented to the user in the UI, and the \`value\` is the value of the prop in the \`run\` method. The \`label\` MUST be set to the property that defines the name of the object, and the \`value\` should be the property that defines the unique identifier of the object.

You MUST define an \`async\` options method if an API endpoint exists that can be used to fetch the options for the prop. This allows Pipedream to make an API call to fetch the options for the prop when the user is configuring the component, rather than forcing the user to enter values for the option manually.

Example async options methods:

\`\`\`
msg: {
  type: "string",
  label: "Message",
  description: "Select a message to \`console.log()\`",
  async options() {
    // write any node code that returns a string[] (with label/value keys)
    return ["This is option 1", "This is option 2"];
  },
},
\`\`\`

Another example:

\`\`\`
board: {
  type: "string",
  label: "Board",
  async options(opts) {
    const boards = await this.getBoards(this.$auth.oauth_uid);
    const activeBoards = boards.filter((board) => board.closed === false);
    return activeBoards.map((board) => {
      return { label: board.name, value: board.id };
    });
  },
},
\`\`\`

And another:

\`\`\`
async options(opts) {
  const response = await axios(this, {
    method: "GET",
    url: \`https://api.spotify.com/v1/me/playlists\`,
    headers: {
      Authorization: \`Bearer \${this.spotify.$auth.oauth_access_token}\`,
    },
  });
  return response.items.map((playlist) => {
    return { label: playlist.name, value: playlist.id };
  });
},
\`\`\`

`;

  const pipedreamPlatformAxiosTypeDefs = `@pipedream/platform axios TypeScript types:
  
import axios from "axios";
import { AxiosRequestConfig as AxiosConfig } from "axios";

interface AxiosRequestConfig extends AxiosConfig {
  debug?: boolean;
  body?: any;
  returnFullResponse?: boolean;
}

function convertAxiosError(err) {
  delete err.response.request;
  err.name = \`\${err.name} - \${err.message}\`;
  try {
    err.message = JSON.stringify(err.response.data);
  }
  catch (error) {
    console.error("Error trying to convert \`err.response.data\` to string");
  }
  return err;
}

function create(config?: AxiosRequestConfig, signConfig?: any) {
  const axiosInstance = axios.create(config);

  if (config?.debug) {
    stepExport(this, config, "debug_config");
  }

  axiosInstance.interceptors.request.use(async (config) => {
    if (signConfig) {
      const oauthSignature = await getOauthSignature(config, signConfig);
      if (!config.headers) config.headers = {};
      config.headers.Authorization = oauthSignature;
    }

    cleanObject(config.headers);
    cleanObject(config.params);
    if (typeof config.data === "object") {
      cleanObject(config.data);
    }
    removeSearchFromUrl(config);

    return config;
  });

  axiosInstance.interceptors.response.use((response) => {
    const config: AxiosRequestConfig = response.config;

    if (config.debug) {
      stepExport(this, response.data, "debug_response");
    }

    return config.returnFullResponse
      ? response
      : response.data;
  }, (error) => {
    if (error.response) {
      convertAxiosError(error);
      stepExport(this, error.response, "debug");
    }

    throw error;
  });

  return axiosInstance;
}
`;

  const axiosInstructions = `Use the \`axios\` constructor from the \`@pipedream/platform\` package to make any HTTP requests. Make sure to include the following import at the top of your Node.js code, above the component, in this exact format:

import { axios } from "@pipedream/platform";

You MUST use that import format when importing axios. Do NOT attempt to import any other package like \`import axios from "@pipedream/platform/axios"\`

The \`axios\` constructor takes two arguments:

1. \`this\` - the \`this\` context of the component.
2. \`config\` - an AxiosRequestConfig object that defines the request to be made. The \`config\` object is the same as the \`config\` object passed to the \`axios\` constructor in the \`axios\` package, with some extra properties.

\`@pipedream/platform\` axios returns a Promise that resolves to the HTTP response data. Remember, @pipedream/platform axios does NOT return a data property / object. The data from the HTTP response is returned directly in the response, not in the \`data\` property. If you want to access the standard axios response object, set \`config.returnFullResponse\` to \`true\`.

${pipedreamPlatformAxiosTypeDefs}`;

  const desiredLanguage = "language: Node.js v14";
  const outputInstructions = "output: Node.js code and ONLY Node.js code. You produce Pipedream component code and ONLY Pipedream component code. You MUST NOT include English before or after code, and MUST NOT include Markdown (like ```javascript) surrounding the code. I just want the code!";
  const propsText = "The object _may_ contain an optional a `props` property, which in this example defines an example string prop. The props object is not required. Include it only if the function / method in the example requires input. Props lets the user pass data to the step via a form in the Pipedream UI, so they can fill in the values of the variables. Include any required parameters as properties of the `props` object. Props must include a human-readable `label` and a `type` (one of string|boolean|integer|object) that corresponds to the Node.js type of the required param. string, boolean, and integer props allow for arrays of input, and the array types are \"string[]\", \"boolean[]\", and \"integer[]\" respectively. Complex props (like arrays of objects) can be passed as string[] props, and each item of the array can be parsed as JSON. If the user asks you to provide an array of object, ALWAYS provide a `type` of string[]. Optionally, props can have a human-readable `description` describing the param. Optional parameters that correspond to the test code should be declared with `optional: true`. Recall that props may contain an `options` method. You MUST define an async options method when the input can be listed from the API (like a list of boards). The options method must return an array of objects with a `label` and `value` property.";
  const alwaysWriteFilestoTmpDir = "If you produce any output files, or if a library produces output files, you MUST write files to the /tmp directory. You MUST NOT write files to `./` or any relative directory. Always write to `/tmp`.";

  // Query for an app
  if (appData && Object.keys(appData).length > 0) {
    const {
      name: app, name_slug, auth_type, description, custom_fields_json, component_code_scaffold_raw, test_request_json,
    } = appData;

    let testRequestURL;
    let testRequestVerb;
    try {
      const parsedTestRequestJSON = JSON.parse(test_request_json);
      testRequestURL = parsedTestRequestJSON?.url;
      testRequestVerb = parsedTestRequestJSON?.http_method;
    } catch {
      // no op
    }

    let authText = `Within the run method, this exposes the user's ${app} credentials in the object \`this.${name_slug}.$auth\`. For integrations where users provide static API keys / tokens, the $auth object contains properties for each key / token the user enters. For OAuth integrations, this object exposes the OAuth access token in the oauth_access_token property of the $auth object. `;
    let testRequestCode;
    if (component_code_scaffold_raw) {
      testRequestCode = `Here's an example Pipedream component that makes a test request against the ${app} API:\n\n${component_code_scaffold_raw}`;
    }
    if (testRequestURL && testRequestVerb) {
      authText += `The test request below makes a ${testRequestVerb} request to ${testRequestURL}. You should use the same base URL in other API requests, and based on the documentation provided / other code on the internet. `;
    }
    if (auth_type === "keys") {
      const customFields = JSON.parse(custom_fields_json);
      const customFieldsText = customFields.map((o: CustomFieldsJSON) => o["name"]).join(", ");
      authText += `${app} is a key-based app. For integrations where users provide static API keys / tokens, \`this.${name_slug}.$auth\` contains properties for each key / token the user enters. Users are asked to enter the following custom fields: ${customFieldsText}. These are each exposed as properties in the object \`this.${name_slug}.$auth\`. When you make the API request, use the format from the ${app} docs. Different apps pass credentials in different places in the HTTP request, e.g. headers, url params, etc. Consult the docs`;
    } else if (auth_type === "oauth") {
      authText += `${app} is an OAuth app. For OAuth integrations, this object exposes the OAuth access token in the variable \`this.${name_slug}.$auth.oauth_access_token\`. When you make the API request, make sure to use the format from the ${app} docs, e.g. you may need to pass the OAuth access token as a Bearer token in the Authorization header. Consult the docs`;
    }
    return `${desiredLanguage}
${outputInstructions}

${typeDefs}

First, I need to teach you what a Pipedream component is. All Pipedream components are Node.js modules that have a default export: \`defineComponent\`. \`defineComponent\` is provided to the environment as a global — you do not need to import \`defineComponent\`. \`defineComponent\` is a function that takes an object — a Pipedream component — as its single argument. The object contains a \`props\` property, which defines a single prop of type "app". This lets the user connect their ${app} account to the step, authorizing requests to the ${app} API (${description}). ${authText}. Don't reference the \`steps\` and \`$\` variables passed to the \`run\` method.

${axiosInstructions}

${testRequestCode}

Here's an example Pipedream component that makes a test request against the Slack API:

export default defineComponent({
  props: {
    slack: {
      type: "app",
      app: "slack",
    },
    channel: {
      type: "string",
      label: "Channel",
      description: "The channel to post the message to",
    },
    text: {
      type: "string",
      label: "Message Text",
      description: "The text of the message to post",
    },
  },
  async run({ steps, $ }) {
    return await axios($, {
      method: "POST",
      url: \`https://slack.com/api/chat.postMessage\`,
      headers: {
        Authorization: \`Bearer $\{this.slack.$auth.oauth_access_token}\`,
      },
      data: {
        channel: this.channel,
        text: this.text,
      },
    });
  },
});

The code you generate should be placed within the \`run\` method of the Pipedream component. Use this format:

import { axios } from "@pipedream/platform";

export default defineComponent({
  props: {
    ${name_slug}: {
      type: "app",
      app: "${name_slug}",
    },
  },
  async run({ steps, $ }) {
    return await axios($, {
      // Add the proper axios configuration object to make the HTTP request here
    });
  },
});

Use ESM for all imports, not CommonJS.

Make sure to include all required headers and parameters in the API request. Please pass literal values as the values of all required params. Use the proper types of values, e.g. "test" for strings and true for booleans. Do not reference \`steps\`, \`$\`, \`this\`, or any other variable in the scope of the \`run\` method.

${propsText}

${asyncOptionsText}

${alwaysWriteFilestoTmpDir}

Make sure to use the correct HTTP method in the \`axios\` request, comparing this to other examples you've been trained on.

Double-check the code against known Node.js examples you've been trained on, both from ${app} examples, GitHub, and any other real code you find.

Only return Node.js code. DO NOT include any English text before or after the Node.js code. DO NOT say something like "Here's an example..." to preface the code. DO NOT include the code in Markdown code blocks, or format it in any fancy way. Just show me the code.

---

`;
  }

  // Query when an app isn't provided (general code)
  return `${desiredLanguage}
${outputInstructions}

${typeDefs}

First, I need to teach you what a Pipedream component is. All Pipedream components are Node.js modules that have a default export: \`defineComponent\`. \`defineComponent\` is provided to the environment as a global — you do not need to import \`defineComponent\`. \`defineComponent\` is a function that takes an object — a Pipedream component — as its single argument. 

${axiosInstructions}

Here's an example Pipedream component that makes a test request using @pipedream/platform axios:

import { axios } from "@pipedream/platform";

export default defineComponent({
  // Remember that props are not required. Use if the example requires human input.
  props: {
    url: {
      type: "string",
      label: "URL to make request to",
    },
    test: {
      type: "string",
      label: "Test Prop",
    },
  },
  async run({ steps, $ }) {
    // Your code should be placed here
    // Example code — returns the value of the input prop to the user
    const upper = this.test.toUpperCase()
    return await axios($, {
      method: "GET",
      url: this.url,
      params: {
        test: this.test
      }
    })
  },
});

${propsText}

Within the run method, the \`this\` variable refers to the component code. All props are exposed at \`this.<name of the key in the props object>\`. e.g. \`this.input\` in the example above.

Don't reference the \`steps\` and \`$\` variables passed to the \`run\` method within the \`run\` method, but include it in the signature. Consider the \`steps\` and \`$\` variables undefined for this example code, unless the prompt asks you to use the \`steps\` object or functions on the $.

imports should be placed at the top of the file. Use ESM for all imports, not CommonJS. DO NOT use the \`import axios from "axios"\` import from the example above in the example you produce, unless the example requires making an HTTP request with \`axios\`. That's just an example to show you where imports for the package should be placed.

If the code requires you make an HTTP request, use \`axios\` to make the request.

The example code should be placed within the \`run\` method of the Pipedream component.

${alwaysWriteFilestoTmpDir}

Double-check the code against known Node.js examples you've been trained on, e.g. from GitHub and any other real code you find.

\`return\` the final value from the step. The data returned from steps must be JSON-serializable. The returned data is displayed in the Pipedream execution logs below the step when the user runs the code.

Only return Node.js code. DO NOT include any English text before or after the Node.js code. DO NOT say something like "Here's an example..." to preface the code. DO NOT include the code in Markdown code blocks, or format it in any fancy way. Just show me the code.

---

`;
};
