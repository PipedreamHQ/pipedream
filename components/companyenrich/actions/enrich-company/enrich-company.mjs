import companyenrich from "../../companyenrich.app.mjs";
import {
  stringValue, companyExpansions, booleanValue,
} from "../../common/utils.mjs";

export default {
  key: "companyenrich-enrich-company",
  name: "Enrich Company",
  description: "Enrich a company from its domain. Costs 1 credit when returned, plus selected paid expansions. With **Wait for Enrichment** set to false, an unstored company fails with HTTP 404 without consuming credits. Eligible misses may schedule background enrichment, but this action returns no pending result and does not retry automatically. [See the documentation](https://docs.companyenrich.com/reference/get_v2-companies-enrich)",
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
  /**
   * Enrich the configured domain with optional expansions and wait behavior.
   * @param {Object} context - Pipedream action execution context.
   * @param {Object} context.$ - Execution context used for requests and the result summary.
   * @returns {Promise<Object>} The company record; provider errors, including an unstored
   * miss, propagate.
   */
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
