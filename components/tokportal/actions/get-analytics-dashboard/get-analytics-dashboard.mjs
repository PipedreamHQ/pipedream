import tokportal from "../../tokportal.app.mjs";

export default {
  key: "tokportal-get-analytics-dashboard",
  name: "Get Analytics Dashboard",
  description: "Get the workspace analytics dashboard (totals, top accounts, top posts) with optional platform, country, account and date filters."
    + " [See the documentation](https://developers.tokportal.com/analytics/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    tokportal,
    platforms: {
      type: "string[]",
      label: "Platforms",
      description: "Only include these platforms, e.g. `[\"tiktok\"]`.",
      options: [
        "tiktok",
        "instagram",
      ],
      optional: true,
    },
    countries: {
      type: "string[]",
      label: "Countries",
      description: "Only include accounts from these country codes, e.g. `[\"US\", \"FR\"]`.",
      optional: true,
    },
    accountIds: {
      type: "string[]",
      label: "Account IDs",
      description: "Only include these delivered account IDs. Use **List Accounts** to find account IDs.",
      optional: true,
    },
    from: {
      type: "string",
      label: "From",
      description: "Start date of the analytics window (`YYYY-MM-DD`).",
      optional: true,
    },
    to: {
      type: "string",
      label: "To",
      description: "End date of the analytics window (`YYYY-MM-DD`).",
      optional: true,
    },
    workspace: {
      type: "string",
      label: "Workspace ID",
      description: "Workspace UUID (only for multi-workspace API keys).",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.tokportal.getAnalyticsDashboard({
      $,
      params: {
        platform: this.platforms,
        country: this.countries,
        account: this.accountIds,
        from: this.from,
        to: this.to,
        workspace: this.workspace,
      },
    });
    $.export("$summary", "Retrieved analytics dashboard");
    return response?.data ?? response;
  },
};
