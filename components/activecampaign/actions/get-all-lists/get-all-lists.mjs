import activecampaign from "../../activecampaign.app.mjs";

export default {
  key: "activecampaign-get-all-lists",
  name: "Get All Lists",
  description: "Retrieves all lists. See the docs [here](https://developers.activecampaign.com/reference/retrieve-all-lists)",
  version: "0.2.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    activecampaign,
    name: {
      type: "string",
      label: "Name Filter",
      description: "Filter by the name of the list",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Limit the number of returned results",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      name,
      limit,
    } = this;

    const response = await this.activecampaign.listLists({
      params: {
        "filters[name]": name,
        limit,
      },
    });

    $.export("$summary", `Successfully found ${response.lists.length} list(s)`);

    return response;
  },
};
