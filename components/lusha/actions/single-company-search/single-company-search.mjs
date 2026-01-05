import { ConfigurationError } from "@pipedream/platform";
import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-single-company-search",
  name: "Search Single Company",
  description: "Search for companies using various filters. [See the documentation](https://docs.lusha.com/apis/index2/company/companycontroller_searchsinglecompany)",
  version: "0.0.1",
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
      description: "The domain name associated with the company",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company Name",
      description: "The name of the company",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.domain && !this.company) {
      throw new ConfigurationError("You must provide either a **Domain** or **Company** name");
    }
    const response = await this.lusha.searchSingleCompany({
      $,
      params: {
        domain: this.domain,
        company: this.company,
      },
    });

    if (response.errors) {
      throw new Error(response.errors.message);
    }
    $.export("$summary", `Successfully found a company with ID: ${response.data.id}`);

    return response;
  },
};
