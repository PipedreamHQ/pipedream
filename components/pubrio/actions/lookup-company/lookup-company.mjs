import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-lookup-company",
  name: "Lookup Company",
  description: "Look up detailed company information by domain or LinkedIn URL. [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/companies/lookup)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    const response = await this.pubrio.lookupCompany({
      $,
      data: {
        [this.lookupType]: val,
      },
    });
    $.export("$summary", `Successfully looked up company by ${this.lookupType}: ${this.value}`);
    return response;
  },
};
