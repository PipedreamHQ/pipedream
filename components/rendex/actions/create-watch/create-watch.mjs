import rendex from "../../rendex.app.mjs";

export default {
  key: "rendex-create-watch",
  name: "Create Watch",
  description: "Create a watch that monitors a page for visual or text changes. [See the documentation](https://rendex.dev/docs/watch#create-a-watch).",
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
    renderFullPage: {
      propDefinition: [
        rendex,
        "renderFullPage",
      ],
    },
    renderSelector: {
      propDefinition: [
        rendex,
        "renderSelector",
      ],
    },
    ignoreText: {
      propDefinition: [
        rendex,
        "ignoreText",
      ],
    },
    minTextChars: {
      propDefinition: [
        rendex,
        "minTextChars",
      ],
    },
    suppressWhilePresent: {
      propDefinition: [
        rendex,
        "suppressWhilePresent",
      ],
    },
    uaMode: {
      propDefinition: [
        rendex,
        "uaMode",
      ],
    },
  },
  methods: {
    // Assemble the watch's stored render knobs from the render* props. Returns
    // undefined when every field is empty so the body omits `renderParams` and
    // the API keeps its defaults (notably fullPage: true). Field names match
    // the API watch schema (schemas/watch-params.ts → WatchRenderParams).
    buildRenderParams() {
      const renderParams = {
        fullPage: this.renderFullPage,
        selector: this.renderSelector,
        ignoreText: this.ignoreText,
        minTextChars: this.minTextChars,
        suppressWhilePresent: this.suppressWhilePresent,
        uaMode: this.uaMode,
      };
      return Object.values(renderParams).some((value) => value !== undefined)
        ? renderParams
        : undefined;
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
        renderParams: this.buildRenderParams(),
      },
    });

    const watch = response.data;
    $.export("$summary", `Created watch ${watch?.id}`);
    return watch;
  },
};
