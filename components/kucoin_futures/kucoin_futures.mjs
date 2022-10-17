import { axios } from "@pipedream/platform";
import crypto from "crypto";
import * as querystring from "querystring";
export default {
  type: "app",
  app: "kucoin_futures",
  description: "Kucoin Futures",
  propDefinitions: {},
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _secretKey() {
      return this.$auth.secret_key;
    },
    _encryptBase64(queryString) {
      return crypto.createHmac("sha256", this._secretKey())
        .update(queryString)
        .digest("base64");
    },
    _passphrase() {
      return this.$auth.passphrase;
    },
    _apiUrl() {
      return "https://api-futures.kucoin.com";
    },
    getHeader(method, path, parameters) {
      const timestamp = Date.now();
      const queryString = method === "GET" || method === "DELETE" ?
        ((parameters)
          ? "?" + querystring.stringify(parameters)
          : "") :
        ((parameters)
          ? JSON.stringify(parameters)
          : "");
      return {
        "Content-Type": "application/json",
        "KC-API-KEY": this._apiKey(),
        "KC-API-TIMESTAMP": timestamp,
        "KC-API-PASSPHRASE": this._encryptBase64(this._passphrase()),
        "KC-API-SIGN": this._encryptBase64(timestamp + method + path + queryString),
        "KC-API-KEY-VERSION": 2,
      };
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {

          "accept": "application/json",
        },
        ...args,
      });
    },
    async makeRequest(method, path, pathParameters) {
      const headers = this.getHeader(method, path, pathParameters);
      return await this._makeRequest({
        path: path,
        method: method,
        headers: headers,
        params: method === "GET" || method === "DELETE"
          ? pathParameters
          : undefined,
        data: method === "PUT" || method === "POST"
          ? pathParameters
          : undefined,
      });
    },
  },
};
