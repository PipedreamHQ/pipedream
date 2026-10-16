import app from "../../whisper.app.mjs";

export default {
  key: "whisper-graph-blast-radius",
  name: "Graph: Dependency Blast Radius",
  description: "Pick one asset and see what would break if it failed - and what it depends on in turn. Maps dependencies in both directions: everything that breaks if the asset fails (SPOFs) and everything it relies on (its own DNS/mail/hosting/network supply chain). Runs the `blast-radius` multi-step flow on the whisper.security graph (keyed - connect your Whisper API key). [See the documentation](https://www.whisper.security/docs/recipes/soc)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    asset: {
      type: "string",
      label: "Asset",
      description: "The asset the recipe runs against (e.g. `ns1.dreamhost.com`, `dns1.p01.nsone.net`, `cloudflare.com`). [Docs](https://www.whisper.security/docs/recipes/soc)",
      default: "ns1.dreamhost.com",
    },
    depth: {
      type: "integer",
      label: "Depth",
      description: "Depth for the recipe. [Docs](https://www.whisper.security/docs/recipes/soc)",
      default: 2,
      optional: true,
    },
  },
  async run({ $ }) {
    const result = await this.app.runGraphRecipe({
      $,
      id: "blast-radius",
      values: {
        asset: this.asset,
        depth: this.depth,
      },
    });
    $.export("$summary", this.app.graphSummary("blast-radius", result));
    return result;
  },
};
