import analytics from "../../google_analytics.app.mjs";

export default {
  key: "google_analytics-get-analytics-reports",
  name: "Get Analytics Reports",
  description: "Retrieves an analytics report based on a request. [See docs](https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet#ReportRequest)",
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
    accountId: {
      propDefinition: [
        analytics,
        "accountId",
        (c) => ({
          token: c.token,
        }),
      ],
    },
    webPropertyId: {
      propDefinition: [
        analytics,
        "webPropertyId",
        (c) => ({
          token: c.token,
          accountId: c.accountId,
        }),
      ],
    },
    viewId: {
      propDefinition: [
        analytics,
        "profileId",
        (c) => ({
          token: c.token,
          accountId: c.accountId,
          webPropertyId: c.webPropertyId,
        }),
      ],
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date for the query in the format YYYY-MM-DD",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The end date for the query in the format YYYY-MM-DD",
      optional: true,
    },
    dimensions: {
      type: "string[]",
      label: "Dimension Names",
      description: "Names of the dimensions to fetch. For more information [see docs](https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet#dimension)",
      optional: true,
    },
    useMetrics: {
      type: "boolean",
      label: "Use Metrics",
      description: "Whether to use Metrics. For attributes [see docs](https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet#metric)",
      default: false,
      reloadProps: true,
    },
    sort: {
      type: "boolean",
      label: "Sort",
      description: "Specify sorting options. For sorting options [see docs](https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet#orderby)",
      default: false,
      reloadProps: true,
    },
  },
  async additionalProps() {
    let props = {};

    if (this.useMetrics) {
      props.metricExpression = {
        type: "string",
        label: "Metric Expression",
        description: "A metric expression in the request",
      };
      props.metricAlias = {
        type: "string",
        label: "Metric alias",
        description: "An alternate name for the metric expression",
        optional: true,
      };
      props.metricFormattingType = {
        type: "string",
        label: "Metric alias",
        description: "Specifies how the metric expression should be formatted",
        optional: true,
        options: [
          "INTEGER",
          "FLOAT",
          "CURRENCY",
          "PERCENT",
          "TIME",
        ],
      };
    }

    if (this.sort) {
      props.sortFieldName = {
        type: "string",
        label: "Sort Field Name",
        description: "The field which to sort by",
      };
      props.sortOrderType = {
        type: "string",
        label: "Sort Order Type",
        description: "Controls how the sort order is being determined. Default is value",
        optional: true,
        options: [
          "VALUE",
          "DELTA",
          "SMART",
          "HISTOGRAM_BUCKET",
          "DIMENSION_AS_INTEGER",
        ],
      };
      props.sortOrder = {
        type: "string",
        label: "Sort Order",
        description: "The sorting order of the sort. The default order is ascending",
        optional: true,
        options: [
          "ASCENDING",
          "DESCENDING",
        ],
      };
    }

    props.useResourceQuotas = {
      type: "boolean",
      label: "Use Resource Quotas",
      description: `Enables resource based quotas, (defaults to false)
        If this field is set to True the per view (profile) quotas are governed by the computational cost of the request`,
      optional: true,
      default: false,
    };

    return props;
  },
  async run({ $ }) {
    let reportRequests = {
      viewId: this.viewId,
    };

    if (this.startDate || this.endDate) {
      let dateRanges = {};
      if (this.startDate) dateRanges.startDate = this.startDate;
      if (this.endDate) dateRanges.endDate = this.endDate;
      reportRequests.dateRanges = [
        dateRanges,
      ];
    }

    if (this.dimensions) {
      reportRequests.dimensions = this.dimensions
        .map((dimension) => ({
          name: dimension,
        }))
        .filter((dimension) => dimension.name);
    }

    if (this.useMetrics) {
      let metrics = {};
      if (this.metricExpression) metrics.expression = this.metricExpression;
      if (this.metricAlias) metrics.alias = this.metricAlias;
      if (this.metricFormattingType) metrics.formattingType = this.metricFormattingType;
      reportRequests.metrics = [
        metrics,
      ];
    }

    if (this.sort) {
      let orderBys = {};
      if (this.sortFieldName) orderBys.fieldName = this.sortFieldName;
      if (this.orderType) orderBys.orderType = this.orderType;
      if (this.sortOrder) orderBys.sortOrder = this.sortOrder;
      reportRequests.orderBys = [
        orderBys,
      ];
    }

    let response = await this.analytics.listReports(
      this.token,
      {
        requestBody: {
          reportRequests,
        },
        useResourceQuotas: this.useResourceQuotas,
      },
    );

    $.export("$summary", `Found report for viewId \`${this.viewId}\``);
    return response;
  },
};
