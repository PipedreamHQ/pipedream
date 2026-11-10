import { ConfigurationError } from "@pipedream/platform";
import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-single-company-search",
  name: "Search Single Company",
  description: "Find one specific company by `Company Domain` or `Company Name` and return its firmographic data (size, revenue range, industry, locations and more) in a single call. Billed per successful result. Returns a \"No company found\" summary when Lusha has no match. To search by filters instead, use **Search Companies**. [See the documentation](https://docs.lusha.com/api-reference/search-&-enrich/search-and-enrich-companies)",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    lusha,
    domain: {
      type: "string",
      label: "Company Domain",
      description: "The domain name associated with the company, e.g. `lusha.com`",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company Name",
      description: "The name of the company, e.g. `Lusha`",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.domain && !this.company) {
      throw new ConfigurationError("You must provide either a **Domain** or **Company** name");
    }
    const { results = [] } = await this.lusha.searchAndEnrichCompanies({
      $,
      data: {
        companies: [
          {
            domain: this.domain,
            name: this.company,
          },
        ],
      },
    });

    const [
      company,
    ] = results;

    if (!company || company.error?.code === "NOT_FOUND") {
      $.export("$summary", "No company found");
      return company ?? {};
    }
    if (company.error) {
      throw new Error(company.error.message || company.error.code);
    }

    $.export("$summary", `Successfully found a company with ID: ${company.id}`);
    return company;
  },
};
