import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "alerty",
  propDefinitions: {
    message: {
      type: "string",
      label: "Message",
      description: "The message to be included in the push notification",
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title for your notification message",
      optional: true,
    },
    image: {
      type: "string",
      label: "Image URL",
      description: "URL of an image to be displayed in the notification",
      optional: true,
    },
    icon: {
      type: "string",
      label: "Icon URL",
      description: "URL of an image to be used as an icon by the notification",
      optional: true,
    },
    deviceId: {
      type: "string[]",
      label: "Device ID",
      description: "Specific device IDs to send the notification to",
      optional: true,
    },
    urgency: {
      type: "string",
      label: "Urgency",
      description: "Urgency of the notification",
      options: [
        "very-low",
        "low",
        "normal",
        "high",
      ],
      default: "very-low",
      optional: true,
    },
    actions: {
      type: "string[]",
      label: "Actions",
      description: "Actions for the notification, each item should be a JSON string",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://alerty.dev/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "POST",
        path = "/notify",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async sendNotification(opts = {}) {
      const {
        message,
        title,
        image,
        icon,
        deviceId,
        urgency,
        actions,
        ...otherOpts
      } = opts;
      const data = {
        message,
        title,
        image,
        icon,
        device_id: deviceId,
        urgency,
        actions: actions
          ? actions.map(JSON.parse)
          : undefined,
      };
      return this._makeRequest({
        data,
        ...otherOpts,
      });
    },
  },
};
