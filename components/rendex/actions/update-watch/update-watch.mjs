import rendex from "../../rendex.app.mjs";

export default {
  key: "rendex-update-watch",
  name: "Update Watch",
  description: "Update a watch, including pausing or resuming it. Only the fields you set are changed. [See the documentation](https://rendex.dev/docs/watch).",
  version: "0.0.1",
  type: "action",
  props: {
    rendex,
    watchId: {
      propDefinition: [
        rendex,
        "watchId",
      ],
    },
    url: {
      type: "string",
      label: "URL",
      description: "New page URL to monitor. Changing it re-baselines the watch on the next run.",
      optional: true,
    },
    name: {
      propDefinition: [
        rendex,
        "name",
      ],
    },
    intervalMinutes: {
      propDefinition: [
        rendex,
        "intervalMinutes",
      ],
    },
    diffMode: {
      propDefinition: [
        rendex,
        "diffMode",
      ],
    },
    threshold: {
      propDefinition: [
        rendex,
        "threshold",
      ],
    },
    webhookUrl: {
      propDefinition: [
        rendex,
        "webhookUrl",
      ],
    },
    notifyEmail: {
      propDefinition: [
        rendex,
        "notifyEmail",
      ],
    },
    paused: {
      propDefinition: [
        rendex,
        "paused",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.rendex.updateWatch(this.watchId, {
      $,
      data: {
        url: this.url,
        name: this.name,
        intervalMinutes: this.intervalMinutes,
        diffMode: this.diffMode,
        threshold: this.threshold !== undefined
          ? Number(this.threshold)
          : undefined,
        webhookUrl: this.webhookUrl,
        notifyEmail: this.notifyEmail,
        paused: this.paused,
      },
    });

    const watch = response.data;
    $.export("$summary", `Updated watch ${this.watchId}`);
    return watch;
  },
};
