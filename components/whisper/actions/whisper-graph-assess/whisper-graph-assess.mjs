import app from "../../whisper.app.mjs";

export default {
  key: "whisper-graph-assess",
  name: "Graph: Threat Posture (whisper.assess)",
  description: "Get a labelled threat posture for a host or IP - malicious, benign, or unknown. Returns a posture label + severity band + sub-labels + coverage + evidence for an indicator; benign-allowlisted vs malicious-evidenced, never a bare score. Runs the `assess` graph procedure on the whisper.security graph (keyed - connect your Whisper API key). [See the documentation](https://www.whisper.security/docs/whisper-graph/procedures)",
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
      description: "The value the recipe runs against (e.g. `8.8.8.8`, `theblackservicenetwork.com`, `185.220.101.33`). [Docs](https://www.whisper.security/docs/whisper-graph/procedures)",
      default: "8.8.8.8",
    },
  },
  async run({ $ }) {
    const result = await this.app.runGraphRecipe({
      $,
      id: "assess",
      values: {
        value: this.value,
      },
    });
    $.export("$summary", this.app.graphSummary("assess", result));
    return result;
  },
};
