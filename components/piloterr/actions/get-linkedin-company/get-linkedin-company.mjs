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
      propDefinition: [
        piloterr,
        "domain",
      ],
      description: "The company's website domain, used when the LinkedIn page is unknown, e.g. `ferrari.com`. Leave empty when `company` is set: the two are mutually exclusive.",
      optional: true,
    },
  },
  async run({ $ }) {
    // A blank input counts as absent everywhere: guard, request and summary.
    const company = this.company?.trim() || undefined;
    const domain = this.domain?.trim() || undefined;
    if (!company === !domain) {
      throw new ConfigurationError("Provide exactly one of the LinkedIn company page or its website domain, not both.");
    }
    const response = await this.piloterr.getLinkedinCompany({
      $,
      params: {
        query: company,
        domain,
      },
    });
    $.export("$summary", `Retrieved the LinkedIn profile of ${response.company_name || company || domain}`);
    return response;
  },
};
