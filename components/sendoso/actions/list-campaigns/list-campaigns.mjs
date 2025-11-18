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
  description: "Retrieve a list of all campaigns with optional filters. [See the documentation](https://sendoso.docs.apiary.io/#reference/campaign-management)",
  type: "action",
  props: {
    sendoso,
    limit: {
      propDefinition: [
        sendoso,
        "limit",
      ],
    },
    offset: {
      propDefinition: [
        sendoso,
        "offset",
      ],
    },
  },
  async run({ $ }) {
    const {
      limit,
      offset,
    } = this;

    const response = await this.sendoso.listCampaigns({
      $,
      params: {
        limit,
        offset,
      },
    });

    const count = Array.isArray(response) ?
      response.length :
      (response.data?.length || 0);
    $.export("$summary", `Successfully retrieved ${count} campaign(s)`);
    return response;
  },
};

