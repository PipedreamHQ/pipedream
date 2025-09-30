import pushover from "../../pushover.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "pushover-emergency-push-notification",
  name: "Emergency Push Notification",
  description: `Sends an Emergency Push Notification to devices with Pushover.
    Notifications are repeated until they are acknowledged by the user.
    More information at [Pushing Messages](https://pushover.net/api#messages) and [Message Priority](https://pushover.net/api#priority)`,
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    sound: {
      propDefinition: [
        pushover,
        "sound",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      message,
      title,
      url,
      urlTitle,
      device,
      retry,
      expire,
      sound,
      callback,
    } = this;
    const response = await this.pushover.pushMessage({
      $,
      params: {
        message,
        title,
        url,
        device,
        priority: constants.PRIORITY.EMERGENCY,
        retry,
        expire,
        sound,
        callback,
        url_title: urlTitle,
      },
    });
    $.export("$summary", `Successfully sent emergency notification with message: "${message}"`);

    return response;
  },
};
