import app from "../../whisper.app.mjs";

export default {
  key: "whisper-graph-walk",
  name: "Graph: Vendor Attribution Walk (whisper.walk)",
  description: "Walk the graph to the nearest known vendors behind a host, with the channel and confidence. Structural attribution: returns nearest_known_vendors with the channel (DELEGATED_TO / ORIGIN_AS) and confidence, plus siblings and coverage - explains WHY a host maps to a vendor. Runs the `walk` graph procedure on the whisper.security graph (keyed - connect your Whisper API key). [See the documentation](https://www.whisper.security/docs/whisper-graph/procedures)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    value: {
      type: "string",
      label: "Value",
      description: "The value the recipe runs against. [Docs](https://www.whisper.security/docs/whisper-graph/procedures)",
      default: "cloudflare.com",
    },
  },
  async run({ $ }) {
    const result = await this.app.runGraphRecipe({
      $,
      id: "walk",
      values: {
        value: this.value,
      },
    });
    $.export("$summary", this.app.graphSummary("walk", result));
    return result;
  },
};
