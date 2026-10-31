import app from "../../whisper.app.mjs";

export default {
  key: "whisper-graph-variants",
  name: "Graph: Typosquat Variant Generator (whisper.variants)",
  description: "Generate look-alike domain variants of a brand and see which are registered. Enumerates permutations (omission, bitsquatting, ...) of a domain, flags which exist, with a per-variant confidence. Runs the `variants` graph procedure on the whisper.security graph (keyed - connect your Whisper API key). [See the documentation](https://www.whisper.security/docs/whisper-graph/procedures/variants)",
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
      description: "The value the recipe runs against. [Docs](https://www.whisper.security/docs/whisper-graph/procedures/variants)",
      default: "paypal.com",
    },
  },
  async run({ $ }) {
    const result = await this.app.runGraphRecipe({
      $,
      id: "variants",
      values: {
        value: this.value,
      },
    });
    $.export("$summary", this.app.graphSummary("variants", result));
    return result;
  },
};
