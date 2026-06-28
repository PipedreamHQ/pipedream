import rendex from "../../rendex.app.mjs";

export default {
  key: "rendex-create-watch",
  name: "Create Watch",
  description: "Create a watch that monitors a page for visual or text changes. [See the documentation](https://rendex.dev/docs/watch).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    rendex,
    url: {
      type: "string",
      label: "URL",
      description: "The page URL to monitor for changes.",
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
    const response = await this.rendex.createWatch({
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
    $.export("$summary", `Created watch ${watch?.id}`);
    return watch;
  },
};
