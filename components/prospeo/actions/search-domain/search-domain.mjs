import { ConfigurationError } from "@pipedream/platform";
import { EMAIL_TYPE_OPTIONS } from "../../common/constants.mjs";
import prospeo from "../../prospeo.app.mjs";

export default {
  name: "Search Domain",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "prospeo-search-domain",
  description: "Discover email addresses associated with a domain name, website, or company name. [See the documentation](https://prospeo.io/api/domain-search)",
  type: "action",
  props: {
    prospeo,
    company: {
      type: "string",
      label: "Company Domain/Name",
      description: "The company domain, website, or name. Using a domain or website is recommended for better accuracy. If submitting a company name, it needs to be between 3 to 75 characters.",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "How many emails you need. The default value is `50`. You will be charged 1 credit every 50 emails. For example, 35 emails will be charged 1 credit while 65 emails will be charged 2 credits.",
      optional: true,
    },
    emailType: {
      type: "string",
      label: "Email Type",
      description: "Indicates what type of email you want to get. `generic` refers to role-based emails such as `info@example.com`, while `professional` are emails of people working at the company.",
      options: EMAIL_TYPE_OPTIONS,
      optional: true,
    },
    companyEnrichment: {
      type: "boolean",
      label: "Company Enrichment",
      description: "Indicates if you want the company details in the response. It is `false` by default. Turning it to `true` might slow-down the response time as we gather the company details.",
    },
  },
  async run({ $ }) {
    try {
      const response = await this.prospeo.searchDomain({
        $,
        data: {
          company: this.company,
          limit: this.limit,
          email_type: this.emailType,
          enrich_company: this.companyEnrichment,
        },
      });

      $.export("$summary", `Successfully searched domain: ${this.company}`);

      return response;
    } catch ({ response }) {
      if (response.data.message === "NO_RESULT") {
        $.export("$summary", `No results found for **${this.company}**`);
        return {};
      } else {
        throw new ConfigurationError(response.data.message);
      }
    }
  },
};
