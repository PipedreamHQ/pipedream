import app from "../../whisper.app.mjs";

export default {
  key: "whisper-graph-psl-tldplusone",
  name: "Graph: Registrable Apex (whisper.psl.tldPlusOne)",
  description: "Reduce any hostname to its registrable apex (eTLD+1) via the Public Suffix List. PSL-correct eTLD+1: www.foo.co.uk -> foo.co.uk. The right way to group hosts by the thing someone actually registered. Runs the `psl-tldplusone` graph procedure on the whisper.security graph (keyed - connect your Whisper API key). [See the documentation](https://www.whisper.security/docs/whisper-graph/procedures/helpers)",
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
      default: "www.foo.co.uk",
    },
  },
  async run({ $ }) {
    const result = await this.app.runGraphRecipe({
      $,
      id: "psl-tldplusone",
      values: {
        value: this.value,
      },
    });
    $.export("$summary", this.app.graphSummary("psl-tldplusone", result));
    return result;
  },
};
