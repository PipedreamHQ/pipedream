import app from "../../whisper.app.mjs";

export default {
  key: "whisper-graph-asset",
  name: "Graph: AS-SET Membership (whisper.asSet)",
  description: "List the member ASNs of an AS-SET macro. Expands an AS-SET name (e.g. AS-CLOUDFLARE) to its member ASNs and source RIR. Arg is a STRING as-set name, not an integer ASN. (Membership is sparsely populated in the current graph.) Runs the `asset` graph procedure on the whisper.security graph (keyed - connect your Whisper API key). [See the documentation](https://www.whisper.security/docs/whisper-graph/procedures)",
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
      default: "AS-CLOUDFLARE",
    },
  },
  async run({ $ }) {
    const result = await this.app.runGraphRecipe({
      $,
      id: "asset",
      values: {
        value: this.value,
      },
    });
    $.export("$summary", this.app.graphSummary("asset", result));
    return result;
  },
};
