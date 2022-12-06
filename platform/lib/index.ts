import * as t from "io-ts";

import axios from "./axios";
import { AxiosRequestConfig as AxiosConfig } from "axios";

export {
  axios,
};
export {
  cloneSafe, jsonStringifySafe,
} from "./utils";

export {
  ConfigurationError,
} from "./errors";

export {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL
} from "./constants"

const SendPayload = t.union([
  t.string,
  t.object,
]);
type SendPayload = t.TypeOf<typeof SendPayload>;

export const SendConfigEmail = t.partial({
  html: t.string,
  subject: t.string,
  text: t.string,
});
export type SendConfigEmail = t.TypeOf<typeof SendConfigEmail>;

export const SendConfigEmit_required = t.strict({
  raw_event: t.object,
});

export const SendConfigEmit_optional = t.partial({
  event: t.object,
});
export const SendConfigEmit = t.intersection([
  SendConfigEmit_required,
  SendConfigEmit_optional,
]);
export type SendConfigEmit = t.TypeOf<typeof SendConfigEmit>;

// interface SendConfigHTTPKv {
// 	[key: string]: string;
// }
const SendConfigHTTPKv = t.object; // XXX should be type above
type SendConfigHTTPKv = t.TypeOf<typeof SendConfigHTTPKv>;
const SendConfigHTTPAuth = t.strict({
  password: t.string,
  username: t.string,
});
type SendConfigHTTPAuth = t.TypeOf<typeof SendConfigHTTPAuth>;
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
export const HTTP_METHODS = [
  "GET",
  "HEAD",
  "POST",
  "PUT",
  "DELETE",
  "CONNECT",
  "OPTIONS",
  "TRACE",
  "PATCH",
];
// HTTP method must be uppercase (for kotlin in coordinator -- i voted to make it case insensitive, but w.e for now)
const SendConfigHTTPMethod = t.keyof(HTTP_METHODS.reduce((acc, v) => {
  acc[v] = null;
  return acc;
}, {}));
type SendConfigHTTPMethod = t.TypeOf<typeof SendConfigHTTPMethod>;
const SendConfigHTTP_required = t.strict({
  method: SendConfigHTTPMethod,
  url: t.string,
});
const SendConfigHTTP_optional = t.partial({
  auth: SendConfigHTTPAuth,
  data: SendPayload,
  headers: SendConfigHTTPKv,
  params: SendConfigHTTPKv,
});
export const SendConfigHTTP = t.intersection([
  SendConfigHTTP_required,
  SendConfigHTTP_optional,
]);
// Mimics axios config. (for now)
export type SendConfigHTTP = t.TypeOf<typeof SendConfigHTTP>;

export const SendConfigS3 = t.strict({
  bucket: t.string,
  payload: SendPayload,
  prefix: t.string,
});
export type SendConfigS3 = t.TypeOf<typeof SendConfigS3>;

export const SendConfigSQL = t.strict({
  payload: SendPayload,
  table: t.string,
});
export type SendConfigSQL = t.TypeOf<typeof SendConfigSQL>;

export const SendConfigSnowflake = t.strict({
  account: t.string,
  database: t.string,
  host: t.string,
  payload: SendPayload,
  pipe_name: t.string,
  private_key: t.string,
  schema: t.string,
  stage_name: t.string,
  user: t.string,
});
export type SendConfigSnowflake = t.TypeOf<typeof SendConfigSnowflake>;

export const SendConfigSSE = t.strict({
  channel: t.string,
  payload: SendPayload,
});
export type SendConfigSSE = t.TypeOf<typeof SendConfigSSE>;

// optionals so we can use self-invoking function below
interface SendFunctionsWrapper {
  email: (config: SendConfigEmail) => void;
  emit: (config: SendConfigEmit) => void;
  http: (config: SendConfigHTTP) => void;
  s3: (config: SendConfigS3) => void;
  sql: (config: SendConfigSQL) => void;
  snowflake: (config: SendConfigSnowflake) => void;
  sse: (config: SendConfigSSE) => void;
}
// XXX would be cool to have this and SendFunctionsWrapper be more shared
export const sendTypeMap = {
  email: SendConfigEmail,
  emit: SendConfigEmit,
  http: SendConfigHTTP,
  s3: SendConfigS3,
  sql: SendConfigSQL,
  snowflake: SendConfigSnowflake,
  sse: SendConfigSSE,
};

// Event object that persists throughout worfklow with observability after each step.
export let $event: any;

export const END_NEEDLE = "__pd_end";
// End workflow with optional message.
export function $end(message?: string): void {
  const err = new Error();
  err[END_NEEDLE] = {
    message,
    ts: new Date().toISOString(),
  };
  throw err;
}

export let $send: SendFunctionsWrapper;

export const $sendConfigRuntimeTypeChecker = (function () {
  const ret = {};
  for (const [
    sendName,
    sendConfigType,
  ] of Object.entries(sendTypeMap)) {
    ret[sendName] = function (config) {
      const result = sendConfigType.decode(config);
      if (!result) throw new Error("io-ts: unexpected decode output");
      if (result._tag === "Left") {
        for (const err of result.left) {
          if (err.message) {
            throw new Error(err.message);
          } else {
            const keyChunks: string[] = [];
            for (const ctx of err.context) {
              if (!ctx.key) continue;
              if (!isNaN(+ctx.key)) continue;
              keyChunks.push(ctx.key);
            }
            throw new Error(`$send.${sendName}: invalid value ${err.value} for ${keyChunks.join(".")}`);
          }
        }
        throw new Error("io-ts: error but could not produce message"); // shouldn't happen...
      }
      // XXX if result !== config they passed extra fields... but expensive
    };
  }
  return ret;
})();

export interface AxiosRequestConfig extends AxiosConfig {
  debug?: boolean;
  body?: any;
}
