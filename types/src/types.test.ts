/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import * as Pipedream from "@pipedream/types";

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
