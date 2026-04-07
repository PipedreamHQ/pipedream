import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-find-similar-companies",
  name: "Find Similar Companies",
  description: "Find companies similar to a given company. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  props: {
    pubrio,
    lookupType: { propDefinition: [pubrio, "lookupTypeDomain"] },
    value: { propDefinition: [pubrio, "lookupValue"] },
    page: { propDefinition: [pubrio, "page"] },
    perPage: { propDefinition: [pubrio, "perPage"] },
  },
  async run({ $ }) {
    const val = this.lookupType === "domain_id" ? parseInt(this.value, 10) : this.value;
    const response = await this.pubrio.makeRequest({
      $,
      method: "POST",
      url: "/companies/lookalikes/search",
      data: {
        [this.lookupType]: val,
        page: this.page ?? 1,
        per_page: this.perPage ?? 25,
      },
    });
    $.export("$summary", `Found ${response.data?.length ?? 0} similar companies`);
    return response;
  },
};
