import donately from "../../donately.app.mjs";

export default {
  key: "donately-list-fundraisers",
  name: "List Fundraisers",
  description: "List fundraisers for an account. [See the documentation](https://developer.donate.ly/api/#fundraisers)",
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
    campaignId: {
      propDefinition: [
        donately,
        "campaignId",
      ],
    },
    limit: {
      propDefinition: [
        donately,
        "limit",
      ],
    },
    offset: {
      propDefinition: [
        donately,
        "offset",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.donately.listFundraisers({
      $,
      params: {
        account_id: this.accountId,
        campaign_id: this.campaignId,
        limit: this.limit,
        offset: this.offset,
      },
    });
    const count = response?.data?.length ?? 0;
    $.export("$summary", `Found ${count} fundraiser${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
