import pushover from "../../pushover.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "pushover-push-notification",
  name: "Push Notification",
  description: "Sends a Push Notification to devices with Pushover. More information at [Pushing Messages](https://pushover.net/api#messages)",
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
      // Consider making this a dynamic prop: https://pipedream.com/docs/components/api/#dynamic-props
      type: "integer",
      label: "Retry",
      description: "Required when using Emergency priority (2). Specifies how often (in seconds) the Pushover servers will send the same notification to the user.",
      optional: true,
    },
    expire: {
      // Consider making this a dynamic prop: https://pipedream.com/docs/components/api/#dynamic-props
      type: "integer",
      label: "Expire",
      description: "Required when using Emergency priority (2). Specifies how many seconds in total your notification will continue to be retried for. Maximum value of 10800 seconds (3 hours).",
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
