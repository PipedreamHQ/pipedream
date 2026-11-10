import piloterr from "../../piloterr.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "piloterr-get-linkedin-company",
  name: "Get LinkedIn Company",
  description: "Get a company's LinkedIn profile, with its industry, size, headquarters, specialties and follower count. Pass either the LinkedIn page or the company's website domain. [See the documentation](https://docs.piloterr.com/v2/api-reference/linkedin/company/info)",
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
      label: "Company Page",
      description: "The LinkedIn company page URL, slug or ID, e.g. `https://www.linkedin.com/company/ferrari`. Leave empty to look the company up by `domain` instead.",
      optional: true,
    },
    domain: {
      type: "string",
      label: "Website Domain",
      description: "The company's website domain, used when the LinkedIn page is unknown, e.g. `ferrari.com`.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.company && !this.domain) {
      throw new ConfigurationError("Provide either the LinkedIn company page or its website domain.");
    }
    const response = await this.piloterr.getLinkedinCompany({
      $,
      params: {
        query: this.company,
        domain: this.domain,
      },
    });
    $.export("$summary", `Retrieved the LinkedIn profile of ${response.company_name ?? this.company ?? this.domain}`);
    return response;
  },
};
