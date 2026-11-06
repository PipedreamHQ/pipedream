import rewardful from "../../rewardful.app.mjs";
import { getItems } from "../../common/utils.mjs";

export default {
  key: "rewardful-list-affiliate-links",
  name: "List Affiliate Links",
  description: "List affiliate links, most recently created first, with each link's URL, token, and visitor, lead, and conversion counts. Use the returned `id` with **Get Affiliate Link** or **Update Affiliate Link**. [See the documentation](https://developers.rewardful.com/rest-api/affiliate-links/list)",
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
    const response = await this.rewardful.listAffiliateLinks({
      $,
      params: {
        page: this.page,
        limit: this.limit,
      },
    });
    const count = getItems(response).length;
    $.export("$summary", `Successfully retrieved ${count} affiliate link${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
