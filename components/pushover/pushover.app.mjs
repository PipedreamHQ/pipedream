import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "pushover",
  propDefinitions: {
    message: {
      type: "string",
      label: "Message",
      description: "The notification message",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The message title",
      optional: true,
    },
    url: {
      type: "string",
      label: "URL",
      description: "A supplementary URL to show with the message",
      optional: true,
    },
    urlTitle: {
      type: "string",
      label: "URL Title",
      description: `A title for the supplementary URL.
        If blank, the URL is shown`,
      optional: true,
    },
    device: {
      type: "string",
      label: "Device",
      description: `The device name to send the message directly.
        Can be comma-separated names for sending to multiple devices`,
      optional: true,
    },
    sound: {
      type: "string",
      label: "Sound",
      description: "The name of the notification sound supported by the device",
      optional: true,
    },
    html: {
      type: "boolean",
      label: "HTML",
      description: "Enables HTML in the message",
      optional: true,
      default: 0,
      options: [
        {
          value: 0,
          label: "Disable HTML",
        },
        {
          value: 1,
          label: "Enable HTML",
        },
      ],
    },
    timestamp: {
      type: "integer",
      label: "Timestamp",
      description: `A unix timestamp of the message date and time to display.
        Otherwise it is the time the message is received by the API`,
      optional: true,
    },
  },
  methods: {
    async makeRequest(config) {
      const {
        $,
        method,
        path,
        params,
      } = config;

      return axios($ ?? this, {
        method,
        url: `${constants.BASE_PATH}${path}${constants.PATH_SUFFIX}`,
        params: {
          token: this.$auth.api_token,
          user: this.$auth.user_key,
          ...params,
        },
      });
    },
    async pushMessage(params = {}) {
      return this.makeRequest({
        method: "post",
        path: "/messages",
        params,
      });
    },
  },
};
