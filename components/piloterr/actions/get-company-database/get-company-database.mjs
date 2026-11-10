import piloterr from "../../piloterr.app.mjs";

export default {
  key: "piloterr-get-company-database",
  name: "Get Company Database",
  description: "Get a company's details from its website domain. For richer profiles, use **Get LinkedIn Company** or **Get Crunchbase Company** with the same domain. [See the documentation](https://docs.piloterr.com/v2/api-reference/database/company)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    piloterr,
    domainName: {
      type: "string",
      label: "Domain Name",
      description: "The website domain of the company, e.g. `piloterr.com`.",
    },
  },
  async run({ $ }) {
    const response = await this.piloterr.getCompanyData({
      $,
      params: {
        query: this.domainName,
      },
    });
    $.export("$summary", `Fetched company data for ${this.domainName}`);
    return response;
  },
};
