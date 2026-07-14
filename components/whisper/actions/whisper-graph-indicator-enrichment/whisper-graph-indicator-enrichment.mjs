import app from "../../whisper.app.mjs";

export default {
  key: "whisper-graph-indicator-enrichment",
  name: "Graph: Indicator Enrichment",
  description: "Turn one domain or IP into a full context card - owner, hosting, mail, location, reputation at a glance. Fills the picture for one indicator: registrant (WHOIS), hosting + country, mail/name servers, network behind it, reputation read. Runs the `indicator-enrichment` multi-step flow on the whisper.security graph (keyed - connect your Whisper API key). [See the documentation](https://www.whisper.security/docs/recipes/dns-email)",
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
      description: "The domain the recipe runs against (e.g. `google.com`, `cloudflare.com`, `185.220.101.33`). [Docs](https://www.whisper.security/docs/recipes/dns-email)",
      default: "google.com",
    },
  },
  async run({ $ }) {
    const result = await this.app.runGraphRecipe({
      $,
      id: "indicator-enrichment",
      values: {
        domain: this.domain,
      },
    });
    $.export("$summary", this.app.graphSummary("indicator-enrichment", result));
    return result;
  },
};
