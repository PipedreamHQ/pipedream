import { v4 as uuid } from "uuid";
import crypto from "crypto";
import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "fiserv",
  methods: {
    getAuth() {
      const {
        url,
        api_key: apiKey,
        secret_key: secretKey,
        environment = constants.ENVIRONMENT.SANDBOX,
      } = this.$auth;
      return {
        url,
        apiKey,
        secretKey,
        environment,
      };
    },
    getUrl(path, apiPath = constants.API_PATH.DEFAULT) {
      const {
        url,
        environment,
      } = this.getAuth();
      const baseUrl = environment === constants.ENVIRONMENT.SANDBOX
        ? `${url}${constants.SANDBOX_PATH}${apiPath}`
        : `${url}${apiPath}`;
      return `${baseUrl}${path}`;
    },
    /**
     * Example at https://docs.fiserv.dev/public/docs/message-signature#example-of-code
     */
    getSignatureHeaders(data) {
      const {
        apiKey,
        secretKey,
        environment,
      } = this.getAuth();

      if (environment === constants.ENVIRONMENT.SANDBOX) {
        return;
      }

      const clientRequestId = uuid();
      const timestamp = Date.now().toString();
      const requestBody = JSON.stringify(data) || "";
      const rawSignature = apiKey + clientRequestId + timestamp + requestBody;

      const computedHmac =
        crypto.createHmac("sha256", secretKey)
          .update(rawSignature)
          .digest("base64");

      return {
        "Client-Request-Id": clientRequestId,
        "Message-Signature": computedHmac,
        "Timestamp": timestamp,
      };
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "API-Key": this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, path, headers, data, apiPath, ...args
    } = {}) {
      return axios($, {
        ...args,
        debug: true,
        url: this.getUrl(path, apiPath),
        data,
        headers: {
          ...this.getHeaders(headers),
          ...this.getSignatureHeaders(data),
        },
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
  },
};
