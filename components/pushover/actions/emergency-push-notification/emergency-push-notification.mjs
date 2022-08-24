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
  },
};
