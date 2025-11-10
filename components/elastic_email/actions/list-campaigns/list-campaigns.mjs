import app from "../../elastic_email.app.mjs";

export default {
  key: "elastic_email-list-campaigns",
  name: "List Campaigns",
  description: "List campaigns in an Elastic Email account. [See the documentation](https://elasticemail.com/developers/api-documentation/rest-api#operation/campaignsGet)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    search: {
      type: "string",
      label: "Search",
      description: "The search query to filter campaigns",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of campaigns to return",
      default: 100,
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The offset to start from",
      default: 0,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.listCampaigns({
      $,
      params: {
        search: this.search,
        limit: this.limit,
        offset: this.offset,
      },
    });
    $.export("$summary", `Successfully listed ${response?.length} campaigns.`);
    return response;
  },
};
