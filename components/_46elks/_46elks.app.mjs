import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "_46elks",
  propDefinitions: {
    number: {
      type: "string",
      label: "Phone Number",
      description: "A phone number",
      async options({
        prevContext,
        mapper = ({
          name: label, number: value,
        }) => ({
          label,
          value,
        }),
      }) {
        const { nextStart } = prevContext;

        if (nextStart === null) {
          return [];
        }

        const {
          data,
          next,
        } = await this.listNumbers({
          params: {
            start: nextStart,
            limit: 100,
          },
        });

        return {
          options: data.map(mapper),
          context: {
            nextStart: next || null,
          },
        };
      },
    },
    message: {
      type: "string",
      label: "Message Text",
      description: "The text of the SMS message to send",
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "This webhook URL will receive a `POST` request every time the delivery status changes.",
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getAuth() {
      const {
        username,
        password,
      } = this.$auth;
      return {
        username,
        password,
      };
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Content-Type": "application/x-www-form-urlencoded",
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      const config = {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
        auth: this.getAuth(),
      };
      return axios($, config);
    },
    post({
      data, ...args
    } = {}) {
      const dataParams = new URLSearchParams(data);
      return this._makeRequest({
        method: "POST",
        data: dataParams.toString(),
        ...args,
      });
    },
    sendSms(args = {}) {
      return this.post({
        path: "/sms",
        ...args,
      });
    },
    makeCall(args = {}) {
      return this.post({
        path: "/calls",
        ...args,
      });
    },
    getAccountDetails() {
      return this._makeRequest({
        path: "/me",
      });
    },
    listNumbers(args = {}) {
      return this._makeRequest({
        path: "/numbers",
        ...args,
      });
    },
    configNumber({
      id, ...args
    } = {}) {
      return this.post({
        path: `/numbers/${id}`,
        ...args,
      });
    },
  },
};
