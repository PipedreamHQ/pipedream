import piloterr from "../../piloterr.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "piloterr-get-crunchbase-company",
  name: "Get Crunchbase Company",
  description: "Get a company's Crunchbase profile, with its description, size, categories, locations, investors and products. Pass either the company name or Crunchbase URL, or its website domain. [See the documentation](https://docs.piloterr.com/v2/api-reference/crunchbase/company/info)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    piloterr,
    company: {
      type: "string",
      label: "Company",
      description: "The company name, Crunchbase permalink or URL, e.g. `openai`. Leave empty to look the company up by `domain` instead.",
      optional: true,
    },
    domain: {
      propDefinition: [
        piloterr,
        "domain",
      ],
      description: "The company's website domain, used when the Crunchbase profile is unknown, e.g. `openai.com`. Leave empty when `company` is set: the two are mutually exclusive.",
      optional: true,
    },
  },
  async run({ $ }) {
    // A blank input counts as absent everywhere: guard, request and summary.
    const company = this.company?.trim() || undefined;
    const domain = this.domain?.trim() || undefined;
    if (!company === !domain) {
      throw new ConfigurationError("Provide exactly one of the company or its website domain, not both.");
    }
    const response = await this.piloterr.getCrunchbaseCompany({
      $,
      params: {
        query: company,
        domain,
      },
    });
    $.export("$summary", `Retrieved the Crunchbase profile of ${response.name || company || domain}`);
    return response;
  },
};
