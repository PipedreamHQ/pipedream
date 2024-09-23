/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import * as Pipedream from "./index";

const stringData: Pipedream.JSONValue = "foo";
const num: Pipedream.JSONValue = 3;
const bool: Pipedream.JSONValue = true;
const n: Pipedream.JSONValue = null;

const arr: Pipedream.JSONValue[] = [
  "hello",
  "world",
];
const arraysAreJSONToo: Pipedream.JSONValue = arr;

const soAreObject: Pipedream.JSONValue = {
  foo: "bar",
  blah: [
    "hello",
    "world",
  ],
  null: null,
  bool: false,
};

// @ts-expect-error $ExpectError - can't serialize functions to JSON
const func: Pipedream.JSONValue = () => { console.log("foo"); };

const httpConfig: Pipedream.SendConfigHTTP = {
  method: "POST",
  url: "https://example.com",
  headers: {
    "Content-Type": "application/json",
  },
  params: {
    foo: "bar",
  },
  auth: {
    username: "user",
    password: "pass",
  },
  data: {
    foo: "bar",
  },
};

const badHTTPConfig: Pipedream.SendConfigHTTP = {
  // @ts-expect-error $ExpectError - bad method
  method: "FOO",
  url: "https://example.com",
  headers: {
    "Content-Type": "application/json",
  },
};

const s3Config: Pipedream.SendConfigS3 = {
  bucket: "foo",
  prefix: "bar/",
  payload: {
    hello: "world",
  },
};

const emailConfig: Pipedream.SendConfigEmail = {
  subject: "foo",
};

const emailOptionalConfig: Pipedream.SendConfigEmail = {
  subject: "foo",
  text: "hello, world",
  html: "<h1>hello, world</h1>",
};

const emitConfig: Pipedream.SendConfigEmit = {
  raw_event: "hello",
};

const emitObjectConfig: Pipedream.SendConfigEmit = {
  raw_event: {
    foo: "bar",
  },
};

const sseConfig: Pipedream.SendConfigSSE = {
  channel: "foo",
  payload: "any",
};

const dollarSend: Pipedream.SendFunctionsWrapper = {
  http: (config: Pipedream.SendConfigHTTP) => { console.log("foo"); },
  email: (config: Pipedream.SendConfigEmail) => { console.log("foo"); },
  emit: (config: Pipedream.SendConfigEmit) => { console.log("foo");},
  s3: (config: Pipedream.SendConfigS3) => { console.log("foo"); },
  sse: (config: Pipedream.SendConfigSSE) => { console.log("foo"); },
};

// @ts-expect-error $ExpectError - Missing s3
const badDollarSend: Pipedream.SendFunctionsWrapper = {
  http: (config: Pipedream.SendConfigHTTP) => { console.log("foo"); },
  email: (config: Pipedream.SendConfigEmail) => { console.log("foo"); },
  emit: (config: Pipedream.SendConfigEmit) => { console.log("foo"); },
  sse: (config: Pipedream.SendConfigSSE) => { console.log("foo"); },
};

const httpResponse: Pipedream.HTTPResponse = {
  status: 200,
  body: JSON.stringify({
    foo: "bar",
  }),
  immediate: true,
};

const methods: Pipedream.Methods = {
  getClient(foo: string, bar: number) {
    return [
      foo,
      bar,
    ];
  },
  randomNum() {
    return Math.random();
  },
};

const googleSheets: Pipedream.App<Pipedream.Methods, Pipedream.AppPropDefinitions> = {
  type: "app",
  app: "google_sheets",
  propDefinitions: {
    sheetId: {
      label: "Sheet ID",
      description: "hello, world",
      type: "integer",
      async options() {
        return [
          1,
          2,
        ];
      },
      optional: true,
      default: "foo",
      min: 0,
      max: 10,
    },
  },
};

const github: Pipedream.App<Pipedream.Methods, Pipedream.AppPropDefinitions> = {
  type: "app",
  app: "github",
  propDefinitions: {
    googleSheets,
    sheetId: {
      propDefinition: [
        googleSheets,
        "sheetId",
      ],
    },
    url: {
      type: "string",
      options: [
        "foo",
        "bar",
      ],
      secret: true,
    },
  },
  methods,
};

const httpProp: Pipedream.InterfaceProp = {
  type: "$.interface.http",
};

const timerProp: Pipedream.InterfaceProp = {
  type: "$.interface.timer",
  default: {
    intervalSeconds: 60 * 15,
  },
};

const httpRequestProp: Pipedream.HttpRequestProp = {
  type: "http_request",
  default: {
    auth: {
      type: "basic",
      username: "u",
      password: "p",
      token: "t",
    },
    body: {
      contentType: "application/json",
      fields: [
        {
          name: "n",
          value: "v",
        },
      ],
      mode: "fields",
      raw: "r",
    },
    headers: [
      {
        name: "n",
        value: "v",
      },
    ],
    method: "POST",
    params: [
      {
        name: "n",
        value: "v",
      },
    ],
    tab: "Params",
    url: "example.com",
  },
};

const hooks: Pipedream.Hooks = {
  deploy: async () => { return; },
  activate: async () => { return; },
  deactivate: async () => { return; },
};

const source: Pipedream.Source<Pipedream.Methods, Pipedream.SourcePropDefinitions> = {
  key: "source",
  name: "Test Source",
  description: "hello, world",
  version: "0.0.1",
  type: "source",
  methods,
  hooks,
  props: {
    googleSheets,
    github,
    url: {
      propDefinition: [
        github,
        "url",
      ],
    },
  },
  dedupe: "unique",
  async run() {
    this.$emit({
      foo: "bar ",
    }, {
      id: "foo",
      name: "channel",
      summary: "Summary",
      ts: 123,
    });
  },
};

const nonDedupedSource: Pipedream.Source<
  Pipedream.Methods,
  Pipedream.SourcePropDefinitions
> = {
  key: "source",
  name: "Test Source",
  description: "hello, world",
  version: "0.0.1",
  type: "source",
  async run() {
    this.$emit(
      {
        foo: "bar ",
      },
      {
        name: "channel",
        summary: "Summary",
        ts: 123,
      },
    );
  },
};

const nonDedupedSourceWithId: Pipedream.Source<
  Pipedream.Methods,
  Pipedream.SourcePropDefinitions
> = {
  key: "source",
  name: "Test Source",
  description: "hello, world",
  version: "0.0.1",
  type: "source",
  async run() {
    this.$emit(
      {
        foo: "bar ",
      },
      {
        id: 246,
        name: "channel",
        summary: "Summary",
        ts: 123,
      },
    );
  },
};

// Bad sources

// @ts-expect-error $ExpectError - Missing key
const sourceMissingKey: Pipedream.Source<Pipedream.Methods, Pipedream.SourcePropDefinitions> = {
  version: "0.0.1",
  type: "source",
  run() { console.log("foo"); },
};

// @ts-expect-error $ExpectError - Missing version
const sourceMissingVersion: Pipedream.Source<Pipedream.Methods, Pipedream.SourcePropDefinitions> = {
  key: "foo",
  type: "source",
  run() { console.log("foo"); },
};

// @ts-expect-error $ExpectError - Missing type
const sourceMissingType: Pipedream.Source<Pipedream.Methods, Pipedream.SourcePropDefinitions> = {
  key: "foo",
  version: "0.0.1",
  run() { console.log("foo"); },
};

const sourceWrongType: Pipedream.Source<Pipedream.Methods, Pipedream.SourcePropDefinitions> = {
  key: "foo",
  version: "0.0.1",
  // @ts-expect-error $ExpectError - bad type
  type: "action",
  run() { console.log("foo"); },
};

const sourceWrongDedupeType: Pipedream.Source<Pipedream.Methods, Pipedream.SourcePropDefinitions> = {
  key: "foo",
  version: "0.0.1",
  type: "source",
  // @ts-expect-error $ExpectError - bad dedupe type
  dedupe: "badValue",
  run() { console.log("foo"); },
};

const sourceReturningDataShouldWarn: Pipedream.Source<Pipedream.Methods, Pipedream.SourcePropDefinitions> = {
  key: "foo",
  version: "0.0.1",
  type: "source",
  // @ts-expect-error $ExpectError - can't return data from source run method
  run(event) { return "data"; },
};

const action: Pipedream.Action<Pipedream.Methods, Pipedream.ActionPropDefinitions> = {
  key: "action",
  name: "Test Action",
  description: "hello, world",
  version: "0.0.1",
  type: "action",
  methods,
  props: {
    googleSheets,
    github,
    url: {
      propDefinition: [
        github,
        "url",
      ],
    },
  },
  async run(event) {
    return "foo";
  },
};

// Bad actions

// @ts-expect-error $ExpectError - Missing key
const actionMissingKey: Pipedream.Action<Pipedream.Methods, Pipedream.ActionPropDefinitions> = {
  version: "0.0.1",
  type: "action",
  run() { console.log("foo"); },
};

// @ts-expect-error $ExpectError - Missing version
const actionMissingVersion: Pipedream.Action<Pipedream.Methods, Pipedream.ActionPropDefinitions> = {
  key: "foo",
  type: "action",
  run() { console.log("foo"); },
};

// @ts-expect-error $ExpectError - Missing type
const actionMissingType: Pipedream.Action<Pipedream.Methods, Pipedream.ActionPropDefinitions> = {
  key: "foo",
  version: "0.0.1",
  run() { console.log("foo"); },
};

const actionWrongType: Pipedream.Action<Pipedream.Methods, Pipedream.ActionPropDefinitions> = {
  key: "foo",
  version: "0.0.1",
  // @ts-expect-error $ExpectError - bad type
  type: "source",
  run() { console.log("foo"); },
};

Pipedream.defineSource({
  key: "source",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  run() {
    this.$emit(
      {},
      // @ts-expect-error $ExpectError - Missing id property in metadata object
      {},
    );
  },
});
