import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "bulkgate",
  propDefinitions: {
    appId: {
      type: "string",
      label: "Application ID",
      description: "The ID of the application you want to use to send the SMS.",
      optional: true,
    },
    appToken: {
      type: "string",
      label: "Application Token",
      description: "The token of the application you want to use to send the SMS.",
      optional: true,
    },
    number: {
      type: "string",
      label: "Recipient Number",
      description: "The phone number you want to send the SMS to.",
    },
    text: {
      type: "string",
      label: "Message Text",
      description: "Text of SMS message (max. 612 characters, or 268 characters if Unicode is used), UTF-8 encoding",
    },
    unicode: {
      type: "boolean",
      label: "Is Unicode",
      description: "`Yes/true/1` for Unicode SMS, `no/false/0` for 7bit SMS.",
      optional: true,
    },
    senderId: {
      type: "string",
      label: "Sender ID",
      description: "Sender ID. If not set, the default sender ID is `gSystem`.",
      optional: true,
      options: Object.values(constants.SENDER_ID),
    },
    senderIdValue: {
      type: "string",
      label: "Sender ID Value",
      description: "Sender value - gOwn (e.g. `420 777 777 777`), gText (e.g. `BulkGate`), gProfile (e.g. `423`), gMobile or gPush (`KEY`).",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Provide the recipients numbers in an international format (with prefix, e.g. `44`) or add the country code in [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) format (`7820125799` + `GB` = `447820125799`). See the country example request. If `null`, your set timezone will be used to fill the information",
      optional: true,
    },
  },
  methods: {
    getBaseUrl(versionPath = constants.VERSION_PATH.V1) {
      return `${constants.BASE_URL}${versionPath}`;
    },
    getUrl({
      path, url, versionPath,
    } = {}) {
      return url || `${this.getBaseUrl(versionPath)}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        ...headers,
      };
    },
    getAppAuth(args) {
      if (!args) {
        return;
      }
      const {
        appId,
        appToken,
        ...rest
      } = args;
      return {
        application_id: appId || this.$auth.app_id,
        application_token: appToken || this.$auth.app_token,
        ...rest,
      };
    },
    makeRequest({
      step = this, path, headers, url, versionPath, params, data, ...args
    } = {}) {
      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl({
          path,
          url,
          versionPath,
        }),
        params: this.getAppAuth(params),
        data: this.getAppAuth(data),
        ...args,
      };
      return axios(step, config);
    },
    create(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
  },
};
