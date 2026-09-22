import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "telesign",
  propDefinitions: {
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number in E.164 format (e.g., `+15555551212`)",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The text content of the SMS message",
    },
    messageType: {
      type: "string",
      label: "Message Type",
      description: "The Telesign message type classification code",
      options: constants.MESSAGE_TYPES,
      default: "ARN",
    },
  },
  methods: {
    getUrl(path, versionPath = constants.VERSION_PATH.V1) {
      return `${constants.BASE_URL}${versionPath}${path}`;
    },
    getAuth() {
      const {
        customer_id: username,
        api_key: password,
      } = this.$auth;
      return {
        username,
        password,
      };
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, versionPath, ...args
    } = {}) {
      const config = {
        ...args,
        url: this.getUrl(path, versionPath),
        headers: this.getHeaders(headers),
        auth: this.getAuth(),
      };
      return axios($, config);
    },
    sendSms(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/messaging",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        ...args,
      });
    },
  },
};
