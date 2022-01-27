import pushover from "../../pushover.app.mjs";

export default {
  key: "pushover-emergency-push-notification",
  name: "Emergency Push Notification",
  description: `Sends an Emergency Push Notification to devices with Pushover.
    Notifications are repeated until they are acknowledged by the user.
    More information at [Pushover API](https://pushover.net/api#priority)`,
  version: "0.0.1",
  type: "action",
  props: {
    pushover,
    message: {
      propDefinition: [
        pushover,
        "message",
      ],
    },
    retry: {
      type: "integer",
      label: "Retry",
      description: "How often, in seconds, Pushover will send the same notification",
      min: 30,
    },
    expire: {
      type: "integer",
      label: "Expire",
      description: "Notification expiration time, in seconds",
      max: 10800,
    },
    callback: {
      type: "string",
      label: "Callback",
      description: "A publicly-accessible URL that Pushover will send a request to when the user has acknowledged the notification",
      optional: true,
    },
    title: {
      propDefinition: [
        pushover,
        "title",
      ],
    },
    url: {
      propDefinition: [
        pushover,
        "url",
      ],
    },
    urlTitle: {
      propDefinition: [
        pushover,
        "urlTitle",
      ],
    },
    device: {
      propDefinition: [
        pushover,
        "device",
      ],
    },
  },
  async run({ $ }) {
    let params = {
      message: this.message,
      retry: this.retry,
      expire: this.expire,
      callback: this.callback,
      title: this.title,
      url: this.url,
      url_title: this.urlTitle,
      device: this.device,
      priority: 2,
    };
    await this.pushover.makeRequest(params);
    $.export("$summary", "Sent emergency notification");
  },
};
