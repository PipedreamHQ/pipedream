import ddg from "../../ddg.app.mjs";

export default {
  key: "ddg-list-services",
  name: "List Services",
  description:
    "List DDG's live service groups and catalog from its public pricing and catalog surfaces. Free."
    + " Returns a compact summary rather than the full catalog payload."
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
  },
  async run({ $ }) {
    const out = await this.ddg.listServices($);

    const pricing = out?.pricing?.body ?? {};
    const catalog = out?.catalog?.body ?? out?.catalog ?? {};

    const summary = {
      pricing_status: out?.pricing?.status,
      catalog_status: out?.catalog?.status,
      service_groups: Object.keys(pricing?.agent_callable_paid_service_groups ?? {}),
      priority_offers: pricing?.agent_callable_paid_service_groups?.ai_agent_priority_offers ?? [],
      catalog_sections: Object.keys(catalog ?? {}).slice(0, 25),
      audience: pricing?.audience,
    };

    $.export("$summary", "Retrieved the DDG service catalog summary");
    return summary;
  },
};
