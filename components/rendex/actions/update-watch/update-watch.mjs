import rendex from "../../rendex.app.mjs";

export default {
  key: "rendex-update-watch",
  name: "Update Watch",
  description: "Update a watch, including pausing or resuming it. Only the fields you set are changed. [See the documentation](https://rendex.dev/docs/watch#endpoints).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    // Assemble the render knobs to PATCH from the render* props. Returns undefined
    // when every field is empty so the body omits `renderParams` and leaves the
    // watch's stored params untouched. Field names match the API watch schema
    // (schemas/watch-params.ts → WatchRenderParams).
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
        renderParams: this.buildRenderParams(),
      },
    });

    const watch = response.data;
    $.export("$summary", `Updated watch ${this.watchId}`);
    return watch;
  },
};
