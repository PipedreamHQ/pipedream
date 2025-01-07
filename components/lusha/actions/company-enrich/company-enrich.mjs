import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-company-enrich",
  name: "Enrich Companies",
  description: "Enriches company information based on provided company IDs. [See the documentation](https://www.lusha.com/docs/#company-enrich)",
  version: "0.0.2",
  type: "action",
  props: {
    lusha,
    requestId: {
      propDefinition: [
        lusha,
        "requestId",
      ],
      label: "Company Request ID",
      description: "The request ID generated from the company search response.",
    },
    companiesIds: {
      propDefinition: [
        lusha,
        "companyIds",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.lusha.enrichCompanies({
      $,
      data: {
        requestId: this.requestId,
        companiesIds: this.companiesIds,
      },
    });
    $.export("$summary", `Successfully enriched ${this.companiesIds.length} companies`);
    return response;
  },
};
