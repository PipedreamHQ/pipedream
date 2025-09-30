import activecampaign from "../../activecampaign.app.mjs";

export default {
  key: "activecampaign-find-deal",
  name: "Find Deal",
  description: "Finds an existing deal by search field. See the docs [here](https://developers.activecampaign.com/reference/list-all-deals)",
  version: "0.2.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    activecampaign,
    search: {
      type: "string",
      label: "Search",
      description: "Search text to use with **Search Field** parameter.",
    },
    field: {
      type: "string",
      label: "Search Field",
      description: "Field to search for. See [available values](https://developers.activecampaign.com/reference/deal#deals-parameters-available-values).",
      options: [
        "all",
        "title",
        "contact",
        "org",
      ],
    },
  },
  async run({ $ }) {
    const {
      search,
      field,
    } = this;

    const response = await this.activecampaign.listDeals({
      params: {
        "filters[search]": search,
        "filters[search_field]": field,
      },
    });

    $.export("$summary", `Successfully found ${response.deals.length} deal(s)`);

    return response;
  },
};
