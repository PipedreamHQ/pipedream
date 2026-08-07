// x-pd-ai: optimized
import brexApp from "../../brex.app.mjs";
import { formatMoney } from "../../common/utils.mjs";

export default {
  key: "brex-get-user-limit",
  name: "Get User Limit",
  description: "Retrieves a person's monthly spend limit and how much of it is still available. Change it with **Set Limit for User**. [See the documentation](https://developer.brex.com/openapi/team_api/users/getuserlimit)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    brexApp,
    userId: {
      propDefinition: [
        brexApp,
        "user",
      ],
      description: "The person whose limit to retrieve.",
      optional: false,
    },
  },
  async run({ $ }) {
    const limit = await this.brexApp.getUserLimit({
      $,
      userId: this.userId,
    });

    const monthlyLimit = formatMoney(limit.monthly_limit);
    const available = formatMoney(limit.monthly_available);

    $.export(
      "$summary",
      monthlyLimit
        ? `Monthly limit ${monthlyLimit}, ${available ?? "unknown"} available`
        : "No monthly limit is set for this user",
    );

    return limit;
  },
};
