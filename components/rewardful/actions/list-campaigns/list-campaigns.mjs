import rewardful from "../../rewardful.app.mjs";
import { getItems } from "../../common/utils.mjs";

export default {
  key: "rewardful-list-campaigns",
  name: "List Campaigns",
  description: "List the campaigns in the Rewardful account, including each campaign's commission settings. Use the returned `id` with **Get Campaign**, **Update Campaign**, or as `campaignId` when filtering **List Affiliates** or creating an affiliate with **Create Affiliate**. [See the documentation](https://developers.rewardful.com/rest-api/campaigns/list-campaigns)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    rewardful,
    page: {
      propDefinition: [
        rewardful,
        "page",
      ],
    },
    limit: {
      propDefinition: [
        rewardful,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.rewardful.listCampaigns({
      $,
      params: {
        page: this.page,
        limit: this.limit,
      },
    });
    const count = getItems(response).length;
    $.export("$summary", `Successfully retrieved ${count} campaign${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
