"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformConfigForOauth = transformConfigForOauth;
var axios_1 = require("axios");
var querystring = require("querystring");
var utils_1 = require("./utils");
var errors_1 = require("./errors");
function cleanObject(o) {
    if (o === void 0) { o = {}; }
    for (var k in o) {
        if (typeof o[k] === "undefined") {
            delete o[k];
        }
    }
}
// remove query params from url and put into config.params
function removeSearchFromUrl(config) {
    if (!config.url)
        return;
    var url = config.url, baseURL = config.baseURL;
    var newUrl = new URL((baseURL !== null && baseURL !== void 0 ? baseURL : "") + url);
    var queryString = newUrl.search.substr(1);
    if (queryString) {
        // https://stackoverflow.com/a/8649003/387413
        var urlParams = JSON.parse("{\"" + queryString.replace(/&/g, "\",\"").replace(/=/g, "\":\"") + "\"}", function (key, value) {
            return key === ""
                ? value
                : decodeURIComponent(value);
        });
        for (var k in urlParams) {
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
function transformConfigForOauth(config) {
    var _a;
    var newUrl = axios_1.default.getUri(__assign(__assign({}, config), { paramsSerializer: oauth1ParamsSerializer }));
    var requestData = {
        method: config.method || "get",
        url: newUrl,
    };
    // the OAuth specification explicitly states that only form-encoded data should be included
    var hasContentType = false;
    var formEncodedContentType = false;
    for (var k in config.headers || {}) {
        if (/content-type/i.test(k)) {
            hasContentType = true;
            formEncodedContentType = ((_a = config.headers) === null || _a === void 0 ? void 0 : _a[k]) === "application/x-www-form-urlencoded";
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
    return requestData;
}
function getOauthSignature(config, signConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var oauthSignerUri, token, requestData, payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    oauthSignerUri = signConfig.oauthSignerUri, token = signConfig.token;
                    requestData = transformConfigForOauth(config);
                    payload = {
                        requestData: requestData,
                        token: token,
                    };
                    return [4 /*yield*/, axios_1.default.post(oauthSignerUri, payload)];
                case 1: return [2 /*return*/, (_a.sent()).data];
            }
        });
    });
}
// XXX warn about mutating config object... or clone?
function callAxios(step, config, signConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var oauthSignature, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cleanObject(config.headers);
                    cleanObject(config.params);
                    if (typeof config.data === "object") {
                        cleanObject(config.data);
                    }
                    if (config.body != null) {
                        throw new errors_1.ConfigurationError("unexpected body, use only data instead");
                    }
                    removeSearchFromUrl(config);
                    if (!signConfig) return [3 /*break*/, 2];
                    return [4 /*yield*/, getOauthSignature(config, signConfig)];
                case 1:
                    oauthSignature = _a.sent();
                    if (!config.headers)
                        config.headers = {};
                    config.headers.Authorization = oauthSignature;
                    _a.label = 2;
                case 2:
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
                    return [4 /*yield*/, (0, axios_1.default)(config)];
                case 3:
                    response = _a.sent();
                    if (config.debug) {
                        stepExport(step, response.data, "debug_response");
                    }
                    return [2 /*return*/, config.returnFullResponse
                            ? response
                            : response.data];
            }
        });
    });
}
function stepExport(step, message, key) {
    message = (0, utils_1.cloneSafe)(message);
    if (step) {
        if (step.export) {
            step.export(key, message);
            return;
        }
        step[key] = message;
    }
    console.log("export: ".concat(key, " - ").concat(JSON.stringify(message, null, 2)));
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
function create(config, signConfig) {
    var _this = this;
    var axiosInstance = axios_1.default.create(config);
    if (config === null || config === void 0 ? void 0 : config.debug) {
        stepExport(undefined, config, "debug_config");
    }
    axiosInstance.interceptors.request.use(function (config) { return __awaiter(_this, void 0, void 0, function () {
        var oauthSignature;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!signConfig) return [3 /*break*/, 2];
                    return [4 /*yield*/, getOauthSignature(config, signConfig)];
                case 1:
                    oauthSignature = _a.sent();
                    if (!config.headers)
                        config.headers = new axios_1.AxiosHeaders();
                    config.headers.Authorization = oauthSignature;
                    _a.label = 2;
                case 2:
                    cleanObject(config.headers);
                    cleanObject(config.params);
                    if (typeof config.data === "object") {
                        cleanObject(config.data);
                    }
                    removeSearchFromUrl(config);
                    return [2 /*return*/, config];
            }
        });
    }); });
    axiosInstance.interceptors.response.use(function (response) {
        var config = response.config;
        if (config.debug) {
            stepExport(undefined, response.data, "debug_response");
        }
        return config.returnFullResponse
            ? response
            : response.data;
    }, function (error) {
        /*if (error.response) {
          convertAxiosError(error);
          stepExport(undefined, error.response, "debug");
        }*/
        throw error;
    });
    return axiosInstance;
}
callAxios.create = create;
exports.default = callAxios;
