import dataforb2b from "../../dataforb2b.app.mjs";

export default {
  key: "dataforb2b-enrich-company",
  name: "Enrich Company",
  description: "Get detailed company data including funding, growth signals, headcount, and more from a company identifier. [See the documentation](https://docs.dataforb2b.ai/api-reference/enrich-company)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    dataforb2b,
    companyIdentifier: {
      propDefinition: [
        dataforb2b,
        "companyIdentifier",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dataforb2b.enrichCompany({
      $,
      data: {
        company_identifier: this.companyIdentifier,
      },
    });

    const name = response.company?.name || this.companyIdentifier;
    $.export("$summary", `Successfully enriched company data for ${name}`);
    return response;
  },
};
