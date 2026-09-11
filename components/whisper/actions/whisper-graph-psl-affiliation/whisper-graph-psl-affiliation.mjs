import app from "../../whisper.app.mjs";

export default {
  key: "whisper-graph-psl-affiliation",
  name: "Graph: PSL Private-Suffix Affiliation (whisper.psl.affiliation)",
  description: "Check whether a domain is a PSL private-section suffix and who submitted it. For a PSL private-section suffix, returns the submitting org/login and evidence kind + confidence; found=false for ordinary registrable domains. Runs the `psl-affiliation` graph procedure on the whisper.security graph (keyed - connect your Whisper API key). [See the documentation](https://www.whisper.security/docs/whisper-graph/procedures/helpers)",
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
      description: "The value the recipe runs against. [Docs](https://www.whisper.security/docs/whisper-graph/procedures/helpers)",
      default: "paypal.com",
    },
  },
  async run({ $ }) {
    const result = await this.app.runGraphRecipe({
      $,
      id: "psl-affiliation",
      values: {
        value: this.value,
      },
    });
    $.export("$summary", this.app.graphSummary("psl-affiliation", result));
    return result;
  },
};
