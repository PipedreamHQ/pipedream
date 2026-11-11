import companyenrich from "../../companyenrich.app.mjs";
import {
  stringArray, stringValue, companyExpansions, booleanValue,
} from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "companyenrich-enrich-companies",
  name: "Enrich Companies in Batch",
  description: "Enrich 1\u201350 domains in one request. Costs 1 credit per unique returned company, plus paid expansions. Preserves found, not-found, invalid-domain and pending results; duplicate domains are enriched once. [See the documentation](https://docs.companyenrich.com/reference/post_v2-companies-enrich-batch)",
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
    domains: {
      "type": "string[]",
      "label": "Company Domains",
      "description": "Between 1 and 50 company domains, e.g. `[\"example.com\", \"example.org\"]`.",
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
    if (!Array.isArray(this.domains)) {
      throw new ConfigurationError("Provide Company Domains as an array of 1–50 domains.");
    }
    const response = await this.companyenrich.enrichCompanies({
      $,
      data: {
        domains: stringArray(this.domains, "Company Domains", 1, 50)
          .map((domain) => stringValue(domain, "Domain", 1024, true)),
        expand: companyExpansions(this.companyExpand),
        waitForEnrichment: booleanValue(this.waitForEnrichment, "Wait for Enrichment", true),
      },
    });
    $.export("$summary", "Retrieved batch enrichment results");
    return response;
  },
};
