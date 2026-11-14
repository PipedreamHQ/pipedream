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
      type: "string",
      label: "Website Domain",
      description: "The company's website domain, used when the Crunchbase profile is unknown, e.g. `openai.com`.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.company && !this.domain) {
      throw new ConfigurationError("Provide either the company or its website domain.");
    }
    const response = await this.piloterr.getCrunchbaseCompany({
      $,
      params: {
        query: this.company,
        domain: this.domain,
      },
    });
    $.export("$summary", `Retrieved the Crunchbase profile of ${response.name ?? this.company ?? this.domain}`);
    return response;
  },
};
