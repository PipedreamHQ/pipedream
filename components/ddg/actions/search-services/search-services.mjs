import ddg from "../../ddg.app.mjs";

export default {
  key: "ddg-search-services",
  name: "Search Services",
  description:
    "Find DDG agent-callable services matching a natural-language need. Free."
    + " Returns service ids, routes, prices and whether a free tier exists."
    + " [See the documentation](https://agents.daedalusdevelopmentgroup.com/llms.txt)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ddg,
    need: {
      type: "string",
      label: "Need",
      description: "What the agent needs, e.g. `check a seller endpoint for x402 conformance`.",
    },
    topK: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of matching services to return, e.g. `8`.",
      default: 8,
      min: 1,
      max: 25,
      optional: true,
    },
  },
  async run({ $ }) {
    const out = await this.ddg.searchServices($, {
      need: this.need,
      topK: this.topK,
    });

    const services = (out?.services ?? []).map((s) => ({
      service_id: s.service_id,
      path: s.path,
      price_usd: s.price_usd,
      has_free_tier: s.has_free_tier,
      description: s.description,
    }));

    $.export("$summary", `Found ${services.length} DDG services for "${this.need}"`);
    return {
      matched: out?.matched ?? services.length,
      total_services: out?.total_services,
      services,
    };
  },
};
