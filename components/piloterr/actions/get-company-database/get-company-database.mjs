import piloterr from "../../piloterr.app.mjs";

export default {
  key: "piloterr-get-company-database",
  name: "Get Company Database",
  description: "Fetches specified data for a company using a domain name. [See the documentation](https://docs.piloterr.com/v2/api-reference/usage)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    piloterr,
    domainName: {
      type: "string",
      label: "Domain Name",
      description: "The domain name of the company to fetch data for",
    },
  },
  async run({ $ }) {
    const response = await this.piloterr.getCompanyData({
      domainName: this.domainName,
    });
    $.export("$summary", `Fetched data for company with domain name: ${this.domainName}`);
    return response;
  },
};
