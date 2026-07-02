import nutshell from "../../nutshell.app.mjs";

export default {
  key: "nutshell-search-companies",
  name: "Search Companies",
  description: "Search companies (accounts) in Nutshell. Returns records in the existing company output format. [See the documentation](https://developers.nutshell.com/reference/ee7a9535ab7ae30da91d6d9cebe2ed85)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    nutshell,
    query: {
      propDefinition: [
        nutshell,
        "query",
      ],
    },
    limit: {
      propDefinition: [
        nutshell,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      "q": this.query,
      "page[limit]": this.limit,
    };
    const companies = await this.nutshell.listAccounts({
      $,
      params,
    });

    $.export("$summary", `Found ${companies.length} company(ies)`);
    return companies.map((c) => this.nutshell.formatCompany(c));
  },
};
