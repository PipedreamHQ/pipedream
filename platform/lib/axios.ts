import axios, {
  AxiosHeaders, AxiosError,
} from "axios";
import { AxiosRequestConfig } from "./index";
import * as querystring from "querystring";
import { cloneSafe } from "./utils";
import { ConfigurationError } from "./errors";

// Type for OAuth1 sign configuration
interface OAuth1SignConfig {
  oauthSignerUri: string;
  token: Record<string, unknown>;
}

// Type for request data used in OAuth signing
interface OAuth1RequestData {
  method: string;
  url: string;
  data?: querystring.ParsedUrlQueryInput;
}

// Type for Pipedream step object
interface PipedreamStep {
  export?: (key: string, value: unknown) => void;
  [key: string]: unknown;
}

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
function oauth1ParamsSerializer(p: querystring.ParsedUrlQueryInput) {
  return querystring.stringify(p)
    .replace(/!/g, "%21")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/\*/g, "%2A");
}

export function transformConfigForOauth(config: AxiosRequestConfig): OAuth1RequestData {
  const newUrl = axios.getUri({
    ...config,
    paramsSerializer: oauth1ParamsSerializer,
  });
  const requestData: OAuth1RequestData = {
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
    requestData.data = config.data as querystring.ParsedUrlQueryInput;
  } else if (typeof config.data === "string" && (!hasContentType || formEncodedContentType)) {
    requestData.data = querystring.parse(config.data);
  }
  config.paramsSerializer = oauth1ParamsSerializer;
  return requestData;
}

async function getOauthSignature(config: AxiosRequestConfig, signConfig: OAuth1SignConfig): Promise<string> {
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
async function callAxios(step: PipedreamStep | undefined, config: AxiosRequestConfig, signConfig?: OAuth1SignConfig) {
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

  /*try {
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
    const axiosErr = err as AxiosError;
    if (axiosErr.response) {
      convertAxiosError(axiosErr);
      stepExport(step, axiosErr.response, "debug");
    }
    throw err;
  }*/

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
}

function stepExport(step: PipedreamStep | undefined, message: unknown, key: string) {
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

/*function convertAxiosError(err: AxiosError) {
  if (err.response) {
    delete err.response.request;
    err.name = `${err.name} - ${err.message}`;
    try {
      err.message = JSON.stringify(err.response.data);
    }
    catch (error) {
      console.error("Error trying to convert `err.response.data` to string");
      console.log(error);
    }
  }
  return err;
}*/

function create(config?: AxiosRequestConfig, signConfig?: OAuth1SignConfig) {
  const axiosInstance = axios.create(config);

  if (config?.debug) {
    stepExport(undefined, config, "debug_config");
  }

  axiosInstance.interceptors.request.use(async (config) => {
    if (signConfig) {
      const oauthSignature = await getOauthSignature(config, signConfig);
      if (!config.headers) config.headers = new AxiosHeaders();
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
      stepExport(undefined, response.data, "debug_response");
    }

    return config.returnFullResponse
      ? response
      : response.data;
  }, (error: AxiosError) => {
    /*if (error.response) {
      convertAxiosError(error);
      stepExport(undefined, error.response, "debug");
    }*/

    throw error;
  });

  return axiosInstance;
}

callAxios.create = create;
export default callAxios;
