// x-pd-ai: optimized
import app from "../../mixpanel_service_account.app.mjs";

export default {
  key: "mixpanel_service_account-query-insights-report",
  name: "Query Insights Report",
  description: "Fetch the computed numbers behind an Insights report that has already been saved in the Mixpanel UI, exactly as the report renders them. Use this when the question maps to a metric the team has already defined and you want their definition rather than your own. For ad-hoc counts where no saved report exists, use **Aggregate Event Counts** instead. [See the documentation](https://docs.mixpanel.com/reference/insights-query)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    bookmarkId: {
      type: "integer",
      label: "Bookmark ID",
      description: "The ID of the saved Insights report. Open the report in Mixpanel and read it from the URL fragment, which looks like `...#id=12345&editor-card-id=%22report-67890%22` - the bookmark ID is the number after `report-` (here, `67890`).",
    },
    workspaceId: {
      propDefinition: [
        app,
        "workspaceId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.queryInsightsReport({
      $,
      params: {
        bookmark_id: this.bookmarkId,
        workspace_id: this.workspaceId,
      },
    });

    const seriesCount = Object.keys(response.series ?? {}).length;
    $.export("$summary", `Retrieved Insights report ${this.bookmarkId} with ${seriesCount} series`);

    return response;
  },
};
