import pushover from "../../pushover.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "pushover-push-notification",
  name: "Push Notification",
  description: "Sends a Push Notification to devices with Pushover. More information at [Pushing Messages](https://pushover.net/api#messages)",
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
    priority: {
      type: "string",
      label: "Priority",
      description: "The message priority. More information at [Pushover API](https://pushover.net/api#priority)",
      optional: true,
      options: constants.PRIORITY_OPTIONS,
    },
    retry: {
      propDefinition: [
        pushover,
        "retry",
      ],
      optional: true,
    },
    expire: {
      propDefinition: [
        pushover,
        "expire",
      ],
      optional: true,
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
      priority,
      retry,
      expire,
      sound,
    } = this;
    const response =
      await this.pushover.pushMessage({
        $,
        params: {
          message,
          title,
          url,
          device,
          priority,
          retry,
          expire,
          sound,
          url_title: urlTitle,
        },
      });
    $.export("$summary", `Successfully sent notification with message: "${message}"`);
    return response;
  },
};
