import donately from "../../donately.app.mjs";

export default {
  key: "donately-list-campaigns",
  name: "List Campaigns",
  description: "List campaigns for an account. [See the documentation](https://developer.donate.ly/api/#campaigns)",
  version: "0.0.1",
  type: "action",
  annotations: {
    openWorldHint: true,
    destructiveHint: false,
    readOnlyHint: true,
  },
  props: {
    donately,
    accountId: {
      propDefinition: [
        donately,
        "accountId",
      ],
    },
    status: {
      type: "string",
      label: "Status",
      description: "Filter campaigns by status.",
      options: [
        "draft",
        "published",
        "archived",
      ],
      optional: true,
    },
    campaignType: {
      type: "string",
      label: "Campaign Type",
      description: "Campaign type filter (e.g. `peer_to_peer`, `donation`).",
      options: [
        "peer_to_peer",
        "donation",
      ],
      optional: true,
    },
    keyword: {
      type: "string",
      label: "Keyword",
      description: "Search by title or content.",
      optional: true,
    },
    hasFundraisers: {
      type: "boolean",
      label: "Has Fundraisers",
      description: "Filter to campaigns with fundraisers.",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        donately,
        "maxResults",
      ],
    },
    sort: {
      propDefinition: [
        donately,
        "sort",
      ],
    },
    orderBy: {
      propDefinition: [
        donately,
        "orderBy",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.donately.getPaginatedResources(this.donately.listCampaigns, {
      $,
      params: {
        account_id: this.accountId,
        status: this.status,
        type: this.campaignType,
        keyword: this.keyword,
        has_fundraisers: this.hasFundraisers,
        sort: this.sort,
        order_by: this.orderBy,
      },
    }, this.maxResults);
    const count = response?.length ?? 0;
    $.export("$summary", `Found ${count} campaign${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
