import charthop from "../../charthop.app.mjs";

export default {
  key: "charthop-search-organization",
  name: "Search Organization",
  description: "Return people, job, group, and field data for a particular org that match a provided search string. [See the documentation](https://api.charthop.com/swagger#/search/searchOrgData)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    charthop,
    orgId: {
      propDefinition: [
        charthop,
        "orgId",
      ],
    },
    q: {
      type: "string",
      label: "Query",
      description: "The search query",
    },
  },
  async run({ $ }) {
    const response = await this.charthop.searchOrganization({
      $,
      orgId: this.orgId,
      params: {
        q: this.q,
        includeFormer: true,
      },
    });

    $.export("$summary", "Successfully completed search query");
    return response;
  },
};
