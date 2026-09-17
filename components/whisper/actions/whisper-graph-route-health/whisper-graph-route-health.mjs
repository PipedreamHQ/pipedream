import app from "../../whisper.app.mjs";

export default {
  key: "whisper-graph-route-health",
  name: "Graph: Network & Routing Report",
  description: "Profile a network or address block into a full routing and reachability health card. Health card for a network/block: what it announces, peers/transit, single-upstream lean, RPKI protection - the one-look reach & resilience report. Runs the `route-health` multi-step flow on the whisper.security graph (keyed - connect your Whisper API key). [See the documentation](https://www.whisper.security/docs/recipes/bgp-routing)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    target: {
      type: "string",
      label: "Target",
      description: "The target the recipe runs against. [Docs](https://www.whisper.security/docs/recipes/bgp-routing)",
      default: "1.1.1.0/24",
    },
  },
  async run({ $ }) {
    const result = await this.app.runGraphRecipe({
      $,
      id: "route-health",
      values: {
        target: this.target,
      },
    });
    $.export("$summary", this.app.graphSummary("route-health", result));
    return result;
  },
};
