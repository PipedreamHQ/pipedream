import app from "../../whisper.app.mjs";

export default {
  key: "whisper-graph-subdomain-takeover",
  name: "Graph: Subdomain Takeover Detection",
  description: "Find subdomains that point at abandoned services an attacker could claim. Walks subdomains and flags ones aiming at deprovisioned targets (dangling CNAME whose target no longer resolves) so you can reclaim/remove before someone else does. CNAME layer is prod-ahead. Runs the `subdomain-takeover` multi-step flow on the whisper.security graph (keyed - connect your Whisper API key). [See the documentation](https://www.whisper.security/docs/recipes/pentest-recon)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    domain: {
      type: "string",
      label: "Domain",
      description: "The domain the recipe runs against. [Docs](https://www.whisper.security/docs/recipes/pentest-recon)",
      default: "github.com",
    },
  },
  async run({ $ }) {
    const result = await this.app.runGraphRecipe({
      $,
      id: "subdomain-takeover",
      values: {
        domain: this.domain,
      },
    });
    $.export("$summary", this.app.graphSummary("subdomain-takeover", result));
    return result;
  },
};
