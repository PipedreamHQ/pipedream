import app from "../../signalraven.app.mjs";

export default {
  key: "signalraven-list-signals",
  name: "List Signals",
  description: "List qualified buying-intent signals, newest first, with an optional minimum strength and type filter. [See the documentation](https://signalraven.ai/developers/api)",
  type: "action",
  ai: "optimized",
  version: "0.0.1",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    minStrength: {
      propDefinition: [
        app,
        "minStrength",
      ],
    },
    signalType: {
      propDefinition: [
        app,
        "signalType",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    offset: {
      propDefinition: [
        app,
        "offset",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listSignals({
      $,
      params: {
        minStrength: this.minStrength,
        type: this.signalType,
        limit: this.limit,
        offset: this.offset,
      },
    });
    const count = response.data?.length || 0;
    $.export("$summary", `Fetched ${count} signal${count === 1
      ? ""
      : "s"} of ${response.total}${response._meta?.mode === "sample"
      ? " (sample data)"
      : ""}.`);
    return response;
  },
};
