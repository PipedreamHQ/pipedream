import app from "../../whisper.app.mjs";

export default {
  key: "whisper-graph-infrastructure-mapping",
  name: "Graph: Digital Infrastructure Mapping",
  description: "Trace one indicator to its true owner and full estate, even behind privacy screens and CDNs. Works out the true operator (even behind privacy WHOIS), de-cloaks CDN-fronted sites to real servers, pivots to the rest of that owner’s estate across every layer. Runs the `infrastructure-mapping` multi-step flow on the whisper.security graph (keyed - connect your Whisper API key). [See the documentation](https://www.whisper.security/docs/recipes/compliance)",
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
      description: "The target the recipe runs against (e.g. `github.com`, `8.8.8.8`, `AS15169`). [Docs](https://www.whisper.security/docs/recipes/compliance)",
      default: "cloudflare.com",
    },
    level: {
      type: "string",
      label: "Level",
      description: "Level for the recipe. [Docs](https://www.whisper.security/docs/recipes/compliance)",
      options: [
        "quick",
        "standard",
        "deep",
        "comprehensive",
        "exhaustive",
      ],
      default: "standard",
      optional: true,
    },
  },
  async run({ $ }) {
    const result = await this.app.runGraphRecipe({
      $,
      id: "infrastructure-mapping",
      values: {
        target: this.target,
        level: this.level,
      },
    });
    $.export("$summary", this.app.graphSummary("infrastructure-mapping", result));
    return result;
  },
};
