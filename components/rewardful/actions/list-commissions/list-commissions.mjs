import rewardful from "../../rewardful.app.mjs";
import constants from "../../common/constants.mjs";
import { getItems } from "../../common/utils.mjs";

export default {
  key: "rewardful-list-commissions",
  name: "List Commissions",
  description: "List commissions, most recently created first, optionally filtered by affiliate and state (`due`, `pending`, `paid`, `voided`). Amounts are in cents. Use the returned `id` with **Get Commission**, **Update Commission**, or **Delete Commission**. [See the documentation](https://developers.rewardful.com/rest-api/commissions/list)",
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
      description: "Only return commissions for this affiliate, e.g. `aaac9869-4242-4db9-afb1-f3518ef627c5`. Use **List Affiliates** to find it (the `id` field).",
      optional: true,
    },
    states: {
      type: "string[]",
      label: "States",
      description: "Only return commissions in these states. Any of `due`, `pending`, `paid`, `voided`, e.g. `[\"pending\", \"due\"]`.",
      options: constants.COMMISSION_STATES,
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
      description: "Related objects to include as nested objects in each result. Any of `sale`, `campaign`, e.g. `[\"sale\"]`.",
      options: [
        "sale",
        "campaign",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.rewardful.listCommissions({
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
    $.export("$summary", `Successfully retrieved ${count} commission${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
