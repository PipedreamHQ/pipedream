"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const buildURL = require("axios/lib/helpers/buildURL");
const querystring = require("querystring");
const utils_1 = require("./utils");
const errors_1 = require("./errors");
function cleanObject(o) {
    for (const k in o || {}) {
        if (typeof o[k] === "undefined") {
            delete o[k];
        }
    }
}
// remove query params from url and put into config.params
function removeSearchFromUrl(config) {
    if (!config.url)
        return;
    const { url, baseURL, } = config;
    const newUrl = new URL((baseURL !== null && baseURL !== void 0 ? baseURL : "") + url);
    const queryString = newUrl.search.substr(1);
    if (queryString) {
        // https://stackoverflow.com/a/8649003/387413
        const urlParams = JSON.parse("{\"" + queryString.replace(/&/g, "\",\"").replace(/=/g, "\":\"") + "\"}", function (key, value) {
            return key === ""
                ? value
                : decodeURIComponent(value);
        });
        for (const k in urlParams) {
            if (!config.params)
                config.params = {};
            if (k in config.params)
                continue; // params object > url query params
            config.params[k] = urlParams[k];
        }
        newUrl.search = "";
        config.url = newUrl.toString(); // if ends with ? should be okay, but could be cleaner
    }
}
// https://github.com/ttezel/twit/blob/master/lib/helpers.js#L11
function oauth1ParamsSerializer(p) {
    return querystring.stringify(p)
        .replace(/!/g, "%21")
        .replace(/'/g, "%27")
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29")
        .replace(/\*/g, "%2A");
}
// XXX warn about mutating config object... or clone?
async function default_1(step, config, signConfig) {
    cleanObject(config.headers);
    cleanObject(config.params);
    if (typeof config.data === "object") {
        cleanObject(config.data);
    }
    if (config.body != null) {
        throw new errors_1.ConfigurationError("unexpected body, use only data instead");
    }
    removeSearchFromUrl(config);
    // OAuth1 request
    if (signConfig) {
        const { oauthSignerUri, token, } = signConfig;
        const { baseURL, url, } = config;
        const newUrl = buildURL((baseURL !== null && baseURL !== void 0 ? baseURL : "") + url, config.params, oauth1ParamsSerializer); // build url as axios will
        const requestData = {
            method: config.method || "get",
            url: newUrl,
        };
        // the OAuth specification explicitly states that only form-encoded data should be included
        let hasContentType = false;
        let formEncodedContentType = false;
        for (const k in config.headers || {}) {
            if (/content-type/i.test(k)) {
                hasContentType = true;
                formEncodedContentType = config.headers[k] === "application/x-www-form-urlencoded";
                break;
            }
        }
        if (config.data && typeof config.data === "object" && formEncodedContentType) {
            requestData.data = config.data;
        }
        else if (typeof config.data === "string" && (!hasContentType || formEncodedContentType)) {
            requestData.data = querystring.parse(config.data);
        }
        config.paramsSerializer = oauth1ParamsSerializer;
        const payload = {
            requestData,
            token,
        };
        const oauthSignature = (await axios_1.default.post(oauthSignerUri, payload)).data;
        if (!config.headers)
            config.headers = {};
        config.headers.Authorization = oauthSignature;
    }
    try {
        if (config.debug) {
            stepExport(step, config, "debug_config");
        }
        const { data } = await axios_1.default(config);
        if (config.debug) {
            stepExport(step, data, "debug_response");
        }
        return data;
    }
    catch (err) {
        if (err.response) {
            convertAxiosError(err);
            stepExport(step, err.response, "debug");
        }
        throw err;
    }
}
exports.default = default_1;
function stepExport(step, message, key) {
    message = utils_1.cloneSafe(message);
    if (step) {
        if (step.export) {
            step.export(key, message);
            return;
        }
        step[key] = message;
    }
    console.log(`export: ${key} - ${JSON.stringify(message, null, 2)}`);
}
function convertAxiosError(err) {
    delete err.response.request;
    err.name = `${err.name} - ${err.message}`;
    err.message = JSON.stringify(err.response.data);
    return err;
}
