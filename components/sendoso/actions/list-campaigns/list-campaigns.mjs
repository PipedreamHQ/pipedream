import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-list-campaigns",
  name: "List Campaigns",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieve a list of all campaigns with optional filters. [See the documentation](https://developer.sendoso.com/rest-api/reference/campaigns/get-campaigns)",
  type: "action",
  props: {
    sendoso,
    page: {
      propDefinition: [
        sendoso,
        "page",
      ],
    },
    perPage: {
      propDefinition: [
        sendoso,
        "perPage",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.sendoso.listCampaigns({
      $,
      params: {
        page: this.page,
        per_page: this.perPage,
      },
    });

    const count = Array.isArray(response) ?
      response.length :
      (response.data?.length || 0);
    $.export("$summary", `Successfully retrieved ${count} campaign(s)`);
    return response;
  },
};

