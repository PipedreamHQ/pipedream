import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-lookup-company",
  name: "Lookup Company",
  description: "Look up detailed company information by domain or LinkedIn URL. [See the documentation](https://docs.pubrio.com)",
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
      url: "/companies/lookup",
      data: { [this.lookupType]: val },
    });
    $.export("$summary", "Successfully looked up company");
    return response;
  },
};
