import pushover from "../../pushover.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "pushover-emergency-push-notification",
  name: "Emergency Push Notification",
  description: `Sends an Emergency Push Notification to devices with Pushover.
    Notifications are repeated until they are acknowledged by the user.
    More information at [Pushing Messages](https://pushover.net/api#messages) and [Message Priority](https://pushover.net/api#priority)`,
  version: "0.0.2",
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
      propDefinition: [
        pushover,
        "retry",
      ],
    },
    expire: {
      propDefinition: [
        pushover,
        "expire",
      ],
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
    const response =
      await this.pushover.pushMessage({
        message: this.message,
        retry: this.retry,
        expire: this.expire,
        callback: this.callback,
        title: this.title,
        url: this.url,
        url_title: this.urlTitle,
        device: this.device,
        priority: constants.PRIORITY.EMERGENCY,
      });
    $.export("$summary", "Sent emergency notification");

    return response;
  },
};
