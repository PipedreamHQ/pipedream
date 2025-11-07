import axios from "axios";
import { AxiosRequestConfig } from "./index";
import * as querystring from "querystring";
import { cloneSafe } from "./utils";
import { ConfigurationError } from "./errors";

function cleanObject(o = {}) {
  for (const k in o) {
    if (typeof o[k] === "undefined") {
      delete o[k];
    }
  }
}

// remove query params from url and put into config.params
function removeSearchFromUrl(config: AxiosRequestConfig) {
  if (!config.url) return;
  const {
    url, baseURL,
  } = config;
  const newUrl = new URL((baseURL ?? "") + url);
  const queryString = newUrl.search.substr(1);
  if (queryString) {
    // https://stackoverflow.com/a/8649003/387413
    const urlParams = JSON.parse("{\"" + queryString.replace(/&/g, "\",\"").replace(/=/g, "\":\"") + "\"}", function (key, value) {
      return key === ""
        ? value
        : decodeURIComponent(value);
    });
    for (const k in urlParams) {
      if (!config.params) config.params = {};
      if (k in config.params) continue; // params object > url query params
      config.params[k] = urlParams[k];
    }
    newUrl.search = "";
    config.url = newUrl.toString(); // if ends with ? should be okay, but could be cleaner
  }
}

// https://github.com/ttezel/twit/blob/master/lib/helpers.js#L11
function oauth1ParamsSerializer(p: any) {
  return querystring.stringify(p)
    .replace(/!/g, "%21")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/\*/g, "%2A");
}

export function transformConfigForOauth(config: AxiosRequestConfig) {
  const newUrl = axios.getUri({
    ...config,
    paramsSerializer: oauth1ParamsSerializer,
  });
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
      formEncodedContentType = config.headers?.[k] === "application/x-www-form-urlencoded";
      break;
    }
  }
  if (config.data && typeof config.data === "object" && formEncodedContentType) {
    (requestData as any).data = config.data;
  } else if (typeof config.data === "string" && (!hasContentType || formEncodedContentType)) {
    (requestData as any).data = querystring.parse(config.data);
  }
  config.paramsSerializer = oauth1ParamsSerializer;
  return requestData;
}

async function getOauthSignature(config: AxiosRequestConfig, signConfig: any) {
  const {
    oauthSignerUri, token,
  } = signConfig;

  const requestData = transformConfigForOauth(config);
  const payload = {
    requestData,
    token,
  };
  return (await axios.post(oauthSignerUri, payload)).data;
}

// XXX warn about mutating config object... or clone?
async function callAxios(step: any, config: AxiosRequestConfig, signConfig?: any) {
  cleanObject(config.headers);
  cleanObject(config.params);
  if (typeof config.data === "object") {
    cleanObject(config.data);
  }
  if (config.body != null) {
    throw new ConfigurationError("unexpected body, use only data instead");
  }
  removeSearchFromUrl(config);

  // OAuth1 request
  if (signConfig) {
    const oauthSignature = await getOauthSignature(config, signConfig);
    if (!config.headers) config.headers = {};
    config.headers.Authorization = oauthSignature;
  }

  try {
    if (config.debug) {
      stepExport(step, config, "debug_config");
    }
    const response = await axios(config);
    if (config.debug) {
      stepExport(step, response.data, "debug_response");
    }

    return config.returnFullResponse
      ? response
      : response.data;
  } catch (err) {
    if (err.response) {
      convertAxiosError(err);
      stepExport(step, err.response, "debug");
    }
    throw err;
  }
}

function stepExport(step: any, message: any, key: string) {
  message = cloneSafe(message);

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
  try {
    err.message = JSON.stringify(err.response.data);
  }
  catch (error) {
    console.error("Error trying to convert `err.response.data` to string");
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
      if (!config.headers) config.headers = {} as any;
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

callAxios.create = create;
export default callAxios;
