import analytics from "../../google_analytics.app.mjs";

export default {
  key: "google_analytics-get-analytics-reports",
  name: "Get Analytics Reports",
  description: "Retrieves a list of analytics reports based on report requests",
  version: "0.0.1",
  type: "action",
  props: {
    analytics,
    token: {
      propDefinition: [
        analytics,
        "token",
      ],
    },
    reportRequests: {
      type: "string[]",
      label: "Report Requests",
      description: `Report Requests, each request will have a separate response
        There can be a maximum of 5 requests. All requests should have the same dateRanges, viewId, segments, samplingLevel, and cohortGroup
        More information at [Analytics Batch Get Method](https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet#ReportRequest)`,
    },
    useResourceQuotas: {
      type: "boolean",
      label: "Use Resource Quotas",
      description: `Enables resource based quotas, (defaults to false)
        If this field is set to True the per view (profile) quotas are governed by the computational cost of the request`,
      optional: true,
    },
  },
  async run({ $ }) {
    let params = {
      requestBody: {
        reportRequests: this.reportRequests.map((request) => JSON.parse(request)),
        useResourceQuotas: this.useResourceQuotas,
      },
    };
    let response = await this.analytics.listReports(
      this.token,
      params,
    );
    const viewId = params.requestBody.reportRequests[0].viewId;
    $.export("$summary", `Found ${response.reports.length} reports(s) for view \`${viewId}\``);
    return response;
  },
};
