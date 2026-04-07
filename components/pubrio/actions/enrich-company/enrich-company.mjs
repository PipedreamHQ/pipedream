import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-enrich-company",
  name: "Enrich Company",
  description: "Get enriched company data with full firmographic details (uses credits). [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  props: {
    pubrio,
    lookupType: { propDefinition: [pubrio, "lookupTypeDomain"] },
    value: { propDefinition: [pubrio, "lookupValue"] },
  },
  async run({ $ }) {
    const val = this.lookupType === "domain_id" ? parseInt(this.value, 10) : this.value;
    const response = await this.pubrio.makeRequest({
      $,
      method: "POST",
      url: "/companies/lookup/enrich",
      data: { [this.lookupType]: val },
    });
    $.export("$summary", "Successfully enriched company");
    return response;
  },
};
