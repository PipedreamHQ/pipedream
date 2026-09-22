import app from "../../signalraven.app.mjs";

export default {
  key: "signalraven-get-signal",
  name: "Get Signal",
  description: "Fetch one signal: the person, ICP analysis, why it matters, suggested opener and talking points. [See the documentation](https://signalraven.ai/developers/api)",
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
    signalId: {
      propDefinition: [
        app,
        "signalId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getSignal({
      $,
      signalId: this.signalId,
    });
    const signal = response.data || response;
    $.export("$summary", `Fetched signal for ${signal.person?.name || this.signalId}.`);
    return response;
  },
};
