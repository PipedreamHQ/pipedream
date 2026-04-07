import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-lookup-lookalike",
  name: "Lookup Lookalike",
  description: "Look up similar companies (lookalike) result by domain, LinkedIn URL, or domain search ID. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  props: {
    pubrio,
    lookupType: {
      type: "string",
      label: "Lookup Type",
      description: "How to identify the company for lookalike lookup",
      options: ["domain", "linkedin_url", "domain_search_id"],
    },
    value: {
      type: "string",
      label: "Value",
      description: "The domain, LinkedIn URL, or domain search ID value",
    },
  },
  async run({ $ }) {
    const response = await this.pubrio.makeRequest({
      $,
      method: "POST",
      url: "/companies/lookalikes/lookup",
      data: { [this.lookupType]: this.value },
    });
    $.export("$summary", "Successfully looked up lookalike");
    return response;
  },
};
