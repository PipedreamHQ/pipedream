import app from "../../whisper.app.mjs";

export default {
  key: "whisper-graph-indicator",
  name: "Graph: Threat Investigation",
  description: "Investigate one suspicious domain, IP, or network in depth and get a clear picture of the threat and everything connected to it. Deep-dive: works outward across the whole footprint (related domains, real origins behind CDN, neighbouring infra), threat-checks each node, never inherits maliciousness from shared infra; labelled posture, no score. Runs the `indicator` multi-step flow on the whisper.security graph (keyed - connect your Whisper API key). [See the documentation](https://www.whisper.security/docs/recipes/soc)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    indicator: {
      type: "string",
      label: "Indicator",
      description: "The indicator the recipe runs against (e.g. `theblackservicenetwork.com`, `185.220.101.33`, `customclothing.in`). [Docs](https://www.whisper.security/docs/recipes/soc)",
      default: "theblackservicenetwork.com",
    },
  },
  async run({ $ }) {
    const result = await this.app.runGraphRecipe({
      $,
      id: "indicator",
      values: {
        indicator: this.indicator,
      },
    });
    $.export("$summary", this.app.graphSummary("indicator", result));
    return result;
  },
};
