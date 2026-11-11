import companyenrich from "../../companyenrich.app.mjs";
import {
  stringValue, companyExpansions, booleanValue,
} from "../../common/utils.mjs";

export default {
  key: "companyenrich-enrich-company",
  name: "Enrich Company",
  description: "Enrich a company from its domain. Costs 1 credit when returned, plus selected paid expansions. On-demand enrichment can return a pending miss; no automatic retry is made. [See the documentation](https://docs.companyenrich.com/reference/get_v2-companies-enrich)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    companyenrich,
    domain: {
      propDefinition: [
        companyenrich,
        "domain",
      ],
      optional: false,
    },
    companyExpand: {
      propDefinition: [
        companyenrich,
        "companyExpand",
      ],
    },
    waitForEnrichment: {
      propDefinition: [
        companyenrich,
        "waitForEnrichment",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.companyenrich.enrichCompany({
      $,
      params: {
        domain: stringValue(this.domain, "Domain", 1024, true),
        expand: companyExpansions(this.companyExpand),
        waitForEnrichment: booleanValue(this.waitForEnrichment, "Wait for Enrichment", true),
      },
    });
    $.export("$summary", `Enriched company ${response.domain ?? response.id ?? "record"}`);
    return response;
  },
};
