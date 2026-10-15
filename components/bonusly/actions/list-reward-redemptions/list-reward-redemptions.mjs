import bonusly from "../../bonusly.app.mjs";

export default {
  key: "bonusly-list-reward-redemptions",
  name: "List Reward Redemptions",
  description: "Return paginated reward redemption records for the caller's company, with optional filtering by user email, date range, and fulfillment status. This is a company-wide admin report, not just the caller's own redemptions. [See the documentation](https://docs.bonus.ly/reference/adminrewardsredemptionsreport-1)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    bonusly,
    userEmail: {
      type: "string",
      label: "User Email",
      description: "Filter to redemptions made by this user's email address, e.g. `john.smith@company.com`.",
      optional: true,
    },
    startDate: {
      propDefinition: [
        bonusly,
        "startDate",
      ],
      description: "Only include redemptions on or after this date, e.g. `2026-01-01`.",
    },
    endDate: {
      propDefinition: [
        bonusly,
        "endDate",
      ],
      description: "Only include redemptions on or before this date, e.g. `2026-06-30`.",
    },
    unfulfilled: {
      type: "boolean",
      label: "Unfulfilled Only",
      description: "Set to `true` to return only redemptions that haven't been fulfilled yet.",
      optional: true,
    },
    aasmState: {
      type: "string",
      label: "State",
      description: "Filter by the redemption's internal state (e.g. `approved`, `pending`, `declined`). Bonusly's docs don't publish the full list of accepted values, so confirm against a real redemption's `aasm_state` field if this filter returns no results. Leave blank to include redemptions in any state.",
      optional: true,
    },
    range: {
      type: "string",
      label: "Range",
      description: "A predefined date range shortcut, if supported by your Bonusly plan (e.g. `this_month`). `Start Date`/`End Date` take precedence when both are set.",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number to fetch, starting at `1`.",
      min: 1,
      optional: true,
    },
    perPage: {
      type: "integer",
      label: "Per Page",
      description: "Number of redemptions to return per page.",
      min: 1,
      max: 100,
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort Field",
      description: "Field to sort results by, e.g. `created_at`.",
      optional: true,
    },
    direction: {
      type: "string",
      label: "Sort Direction",
      description: "Sort direction for the `Sort Field`, e.g. `asc` or `desc`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bonusly.getAdminRewardsRedemptionsReport({
      $,
      userEmail: this.userEmail,
      startDate: this.startDate,
      endDate: this.endDate,
      unfulfilled: this.unfulfilled,
      aasmState: this.aasmState,
      range: this.range,
      page: this.page,
      perPage: this.perPage,
      sort: this.sort,
      direction: this.direction,
    });

    $.export("$summary", `Found ${response.pagination?.total_count ?? 0} reward redemption(s)`);
    return response;
  },
};
