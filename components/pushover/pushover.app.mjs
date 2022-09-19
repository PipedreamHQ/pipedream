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
    retry: {
      type: "integer",
      label: "Retry",
      description: "How often, in seconds, Pushover will send the same notification. In a situation where your user might be in a noisy environment or sleeping, retrying the notification (with sound and vibration) will help get his or her attention. This parameter must have a value of at least 30 seconds between retries.",
      min: 30,
    },
    expire: {
      type: "integer",
      label: "Expire",
      description: "Notification expiration time, in seconds. If the notification has not been acknowledged in expire seconds, it will be marked as expired and will stop being sent to the user. Note that the notification is still shown to the user after it is expired, but it will not prompt the user for acknowledgement. This parameter must have a maximum value of at most 10800 seconds (3 hours).",
      max: 10800,
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
