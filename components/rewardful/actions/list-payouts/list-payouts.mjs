import rewardful from "../../rewardful.app.mjs";
import constants from "../../common/constants.mjs";
import { getItems } from "../../common/utils.mjs";

export default {
  key: "rewardful-list-payouts",
  name: "List Payouts",
  description: "List payouts (bundles of commissions owed to one affiliate), most recently created first, optionally filtered by affiliate and state (`pending`, `due`, `processing`, `paid`). Amounts are in cents. Use the returned `id` with **Get Payout** or **Mark Payout as Paid**. [See the documentation](https://developers.rewardful.com/rest-api/payouts/list-payouts)",
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
    affiliateId: {
      propDefinition: [
        rewardful,
        "affiliateId",
      ],
      description: "Only return payouts for this affiliate, e.g. `aaac9869-4242-4db9-afb1-f3518ef627c5`. Use **List Affiliates** to find it (the `id` field).",
      optional: true,
    },
    states: {
      type: "string[]",
      label: "States",
      description: "Only return payouts in these states. Any of `pending`, `due`, `processing`, `paid`, e.g. `[\"due\"]`.",
      options: constants.PAYOUT_STATES,
      optional: true,
    },
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
    expand: {
      propDefinition: [
        rewardful,
        "expand",
      ],
      description: "Related objects to include as nested objects in each result. Any of `affiliate`, `commissions`, e.g. `[\"affiliate\"]`.",
      options: [
        "affiliate",
        "commissions",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.rewardful.listPayouts({
      $,
      params: {
        affiliate_id: this.affiliateId,
        state: this.states,
        page: this.page,
        limit: this.limit,
        expand: this.expand,
      },
    });
    const count = getItems(response).length;
    $.export("$summary", `Successfully retrieved ${count} payout${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
