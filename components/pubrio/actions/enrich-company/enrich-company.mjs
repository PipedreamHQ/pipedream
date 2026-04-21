import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-enrich-company",
  name: "Enrich Company",
  description: "Get enriched company data with full firmographic details (uses credits). [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/companies/enrichment)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pubrio,
    lookupType: {
      propDefinition: [
        pubrio,
        "lookupTypeDomain",
      ],
    },
    value: {
      propDefinition: [
        pubrio,
        "lookupValue",
      ],
    },
  },
  async run({ $ }) {
    let val = this.value;
    if (this.lookupType === "domain_id") {
      if (!/^\d+$/.test(this.value)) {
        throw new Error(`domain_id must be a valid integer, got: "${this.value}"`);
      }
      val = parseInt(this.value, 10);
    }
    const response = await this.pubrio.enrichCompany({
      $,
      data: {
        [this.lookupType]: val,
      },
    });
    $.export("$summary", `Successfully enriched company by ${this.lookupType}: ${this.value}`);
    return response;
  },
};
