import pushover from "../../pushover.app.mjs";

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
      default: 0,
      options: [
        {
          value: -2,
          label: "Lowest, no alert",
        },
        {
          value: -1,
          label: "Low, no sound",
        },
        {
          value: 0,
          label: "Normal",
        },
        {
          value: 1,
          label: "High priority, bypass quiet hours",
        },
      ],
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
      });
    $.export("$summary", "Sent notification");
    return response;
  },
};
