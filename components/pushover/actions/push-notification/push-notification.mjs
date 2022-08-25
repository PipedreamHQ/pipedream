import pushover from "../../pushover.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "pushover-push-notification",
  name: "Push Notification",
  description: "Sends a Push Notification to devices with Pushover. More information at [Pushing Messages](https://pushover.net/api#messages)",
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
      type: "integer",
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
  },
  async run({ $ }) {
    const response =
      await this.pushover.pushMessage({
        message: this.message,
        title: this.title,
        url: this.url,
        url_title: this.urlTitle,
        device: this.device,
        priority: this.priority,
        retry: this.retry,
        expire: this.expire,
      });
    $.export("$summary", "Sent notification");
    return response;
  },
};
