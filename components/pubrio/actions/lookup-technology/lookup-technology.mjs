import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-lookup-technology",
  name: "Lookup Technology",
  description: "Look up technologies used by a company. [See the documentation](https://docs.pubrio.com)",
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
      url: "/technologies/lookup",
      data: { [this.lookupType]: val },
    });
    $.export("$summary", "Successfully looked up technologies");
    return response;
  },
};
