import { axios } from "@pipedream/platform";
import jsSHA from "jssha";

export default {
  type: "app",
  app: "dux_soup",
  propDefinitions: {
    targetProfileUrl: {
      type: "string",
      label: "Target Profile URL",
      description: "The URL of the LinkedIn profile you want to target",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message to send to the targeted LinkedIn profile",
    },
  },
  methods: {
    _getBaseUrl() {
      return `${this.$auth.target_url}/queue`;
    },
    _getCommandRequestBody(requestBody) {
      return JSON.stringify({
        ...requestBody,
        targeturl: `${this.$auth.target_url}/queue`,
        userid: `${this.$auth.user_id}`,
        timestamp: +new Date(),
      });
    },
    _getSignature(commandRequestBody) {
      let shaObj = new jsSHA("SHA-1", "TEXT");
      shaObj.setHMACKey(`${this.$auth.auth_key}`, "TEXT");
      shaObj.update(commandRequestBody);
      return shaObj.getHMAC("B64");
    },
    makeRequest({
      $ = this, requestBody,
    }) {
      const commandRequestBody = this._getCommandRequestBody(requestBody);
      return axios($, {
        url: this._getBaseUrl(),
        method: "POST",
        headers: {
          "X-Dux-Signature": this._getSignature(commandRequestBody),
          "Content-Type": "application/json",
        },
        data: commandRequestBody,
      });
    },
  },
};
