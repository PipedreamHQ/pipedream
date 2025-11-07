"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$sendConfigRuntimeTypeChecker = exports.$send = exports.$end = exports.END_NEEDLE = exports.$event = exports.sendTypeMap = exports.SendConfigSSE = exports.SendConfigSnowflake = exports.SendConfigSQL = exports.SendConfigS3 = exports.SendConfigHTTP = exports.HTTP_METHODS = exports.SendConfigEmit = exports.SendConfigEmit_optional = exports.SendConfigEmit_required = exports.SendConfigEmail = exports.DEFAULT_POLLING_SOURCE_TIMER_INTERVAL = exports.sqlProxy = exports.sqlProp = exports.ConfigurationError = exports.jsonStringifySafe = exports.cloneSafe = exports.transformConfigForOauth = exports.axios = void 0;
const t = require("io-ts");
const axios_1 = require("./axios");
exports.axios = axios_1.default;
Object.defineProperty(exports, "transformConfigForOauth", { enumerable: true, get: function () { return axios_1.transformConfigForOauth; } });
var utils_1 = require("./utils");
Object.defineProperty(exports, "cloneSafe", { enumerable: true, get: function () { return utils_1.cloneSafe; } });
Object.defineProperty(exports, "jsonStringifySafe", { enumerable: true, get: function () { return utils_1.jsonStringifySafe; } });
var errors_1 = require("./errors");
Object.defineProperty(exports, "ConfigurationError", { enumerable: true, get: function () { return errors_1.ConfigurationError; } });
var sql_prop_1 = require("./sql-prop");
Object.defineProperty(exports, "sqlProp", { enumerable: true, get: function () { return sql_prop_1.default; } });
var sql_proxy_1 = require("./sql-proxy");
Object.defineProperty(exports, "sqlProxy", { enumerable: true, get: function () { return sql_proxy_1.default; } });
var constants_1 = require("./constants");
Object.defineProperty(exports, "DEFAULT_POLLING_SOURCE_TIMER_INTERVAL", { enumerable: true, get: function () { return constants_1.DEFAULT_POLLING_SOURCE_TIMER_INTERVAL; } });
const SendPayload = t.union([
    t.string,
    t.object,
]);
exports.SendConfigEmail = t.partial({
    html: t.string,
    subject: t.string,
    text: t.string,
});
exports.SendConfigEmit_required = t.strict({
    raw_event: t.object,
});
exports.SendConfigEmit_optional = t.partial({
    event: t.object,
});
exports.SendConfigEmit = t.intersection([
    exports.SendConfigEmit_required,
    exports.SendConfigEmit_optional,
]);
// interface SendConfigHTTPKv {
// 	[key: string]: string;
// }
const SendConfigHTTPKv = t.object; // XXX should be type above
const SendConfigHTTPAuth = t.strict({
    password: t.string,
    username: t.string,
});
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
exports.HTTP_METHODS = [
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
const SendConfigHTTPMethod = t.keyof(exports.HTTP_METHODS.reduce((acc, v) => {
    acc[v] = null;
    return acc;
}, {}));
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
exports.SendConfigHTTP = t.intersection([
    SendConfigHTTP_required,
    SendConfigHTTP_optional,
]);
exports.SendConfigS3 = t.strict({
    bucket: t.string,
    payload: SendPayload,
    prefix: t.string,
});
exports.SendConfigSQL = t.strict({
    payload: SendPayload,
    table: t.string,
});
exports.SendConfigSnowflake = t.strict({
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
exports.SendConfigSSE = t.strict({
    channel: t.string,
    payload: SendPayload,
});
// XXX would be cool to have this and SendFunctionsWrapper be more shared
exports.sendTypeMap = {
    email: exports.SendConfigEmail,
    emit: exports.SendConfigEmit,
    http: exports.SendConfigHTTP,
    s3: exports.SendConfigS3,
    sql: exports.SendConfigSQL,
    snowflake: exports.SendConfigSnowflake,
    sse: exports.SendConfigSSE,
};
exports.END_NEEDLE = "__pd_end";
// End workflow with optional message.
function $end(message) {
    const err = new Error();
    err[exports.END_NEEDLE] = {
        message,
        ts: new Date().toISOString(),
    };
    throw err;
}
exports.$end = $end;
exports.$sendConfigRuntimeTypeChecker = (function () {
    const ret = {};
    for (const [sendName, sendConfigType,] of Object.entries(exports.sendTypeMap)) {
        ret[sendName] = function (config) {
            const result = sendConfigType.decode(config);
            if (!result)
                throw new Error("io-ts: unexpected decode output");
            if (result._tag === "Left") {
                for (const err of result.left) {
                    if (err.message) {
                        throw new Error(err.message);
                    }
                    else {
                        const keyChunks = [];
                        for (const ctx of err.context) {
                            if (!ctx.key)
                                continue;
                            if (!isNaN(+ctx.key))
                                continue;
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
