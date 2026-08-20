import ramp from "../../ramp.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "ramp-update-limit",
  name: "Update Limit",
  description: "Update spending restrictions on an existing Ramp spend limit. Run the **List Limits** action to find the limit ID. [See the documentation](https://docs.ramp.com/developer-api/v1/api/funds).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ramp,
    limitId: {
      type: "string",
      label: "Limit ID",
      description: "The ID of the spend limit to update. Run the **List Limits** action to find this value.",
    },
    displayName: {
      type: "string",
      label: "Display Name",
      description: "New display name for the limit.",
      optional: true,
    },
    interval: {
      type: "string",
      label: "Interval",
      description: "Spending interval for the restriction (e.g. `MONTHLY`).",
      options: constants.INTERVALS,
      optional: true,
    },
    spendingRestrictions: {
      type: "object",
      label: "Spending Restrictions",
      description: "JSON object of spending restrictions to apply. Example: `{\"amount\": 50000, \"interval\": \"MONTHLY\", \"currency\": \"USD\"}`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.ramp.updateLimit({
      $,
      limitId: this.limitId,
      data: {
        display_name: this.displayName,
        interval: this.interval,
        spending_restrictions: this.spendingRestrictions,
      },
    });
    $.export("$summary", `Successfully updated limit ${this.limitId}`);
    return response;
  },
};
