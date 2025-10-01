import app from "../../google_ad_manager.app.mjs";
import dimensions from "../../common/dimensions.mjs";
import metrics from "../../common/metrics.mjs";
import relativeDateRanges from "../../common/relative-date-ranges.mjs";
import utils from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "google_ad_manager-create-report",
  name: "Create Report",
  description: "Create a report in Google Ad Manager. [See the documentation](https://developers.google.com/ad-manager/api/beta/reference/rest/v1/networks.reports/create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    parent: {
      label: "Parent Network",
      description: "The parent resource where this Report will be created. Format: `networks/{networkCode}`.",
      propDefinition: [
        app,
        "network",
      ],
    },
    name: {
      label: "Name",
      description: "Identifier. The resource name of the report. Report resource names have the form: `networks/{networkCode}/reports/{reportId}`.",
      type: "string",
    },
    visibility: {
      type: "string",
      label: "Visibility",
      description: "The visibility of the report.",
      options: constants.VISIBILITY_OPTIONS,
    },
    displayName: {
      type: "string",
      label: "Display Name",
      description: "The display name of the report.",
      optional: true,
    },
    scheduleOptions: {
      type: "object",
      label: "Schedule Options",
      description: "The options for a scheduled report. [See the documentation](https://developers.google.com/ad-manager/api/beta/reference/rest/v1/networks.reports#ScheduleOptions).",
      optional: true,
    },
    dimensions: {
      type: "string[]",
      label: "Dimensions",
      description: "The list of dimensions to report on. If empty, the report will have no dimensions, and any metrics will be totals.",
      options: Object.values(dimensions),
    },
    metrics: {
      type: "string[]",
      label: "Metrics",
      description: "The list of metrics to report on. If empty, the report will have no metrics.",
      options: Object.values(metrics),
    },
    filters: {
      type: "string[]",
      label: "Filters",
      description: "The filters for this report. Each row must be formatted as a JSON object. [See the documentation](https://developers.google.com/ad-manager/api/beta/reference/rest/v1/networks.reports#filter).",
      optional: true,
    },
    timeZone: {
      type: "string",
      label: "Time Zone",
      description: "The time zone the date range is defined in for this report. Defaults to publisher's time zone if not specified. Time zone in IANA format. Acceptable values depend on the report type. Publisher time zone is always accepted. Use `America/Los_Angeles` for pacific time, or `Etc/UTC` for UTC.",
      optional: true,
    },
    currencyCode: {
      type: "string",
      label: "Currency Code",
      description: "The ISO 4217 currency code for this report. Defaults to publisher currency code if not specified.",
      optional: true,
    },
    customDimensionKeyIds: {
      type: "string[]",
      label: "Custom Dimension Key IDs",
      description: "Custom Dimension keys that represent `CUSTOM_DIMENSION_*` dimensions. The index of this repeated field corresponds to the index on each dimension. For example, `customDimensionKeyIds[0]` describes `CUSTOM_DIMENSION_0_VALUE_ID` and `CUSTOM_DIMENSION_0_VALUE`.",
      optional: true,
    },
    lineItemCustomFieldIds: {
      type: "string[]",
      label: "Line Item Custom Field IDs",
      description: "Custom field IDs that represent `LINE_ITEM_CUSTOM_FIELD_*` dimensions. The index of this repeated field corresponds to the index on each dimension. For example, `lineItemCustomFieldIds[0]` describes `LINE_ITEM_CUSTOM_FIELD_0_OPTION_ID` and `LINE_ITEM_CUSTOM_FIELD_0_VALUE`.",
      optional: true,
    },
    orderCustomFieldIds: {
      type: "string[]",
      label: "Order Custom Field IDs",
      description: "Custom field IDs that represent `ORDER_CUSTOM_FIELD_*` dimensions. The index of this repeated field corresponds to the index on each dimension. For example, `orderCustomFieldIds[0]` describes `ORDER_CUSTOM_FIELD_0_OPTION_ID` and `ORDER_CUSTOM_FIELD_0_VALUE`.",
      optional: true,
    },
    creativeCustomFieldIds: {
      type: "string[]",
      label: "Creative Custom Field IDs",
      description: "Custom field IDs that represent `CREATIVE_CUSTOM_FIELD_*` dimensions. The index of this repeated field corresponds to the index on each dimension. For example, `creativeCustomFieldIds[0]` describes `CREATIVE_CUSTOM_FIELD_0_OPTION_ID` and `CREATIVE_CUSTOM_FIELD_0_VALUE`.",
      optional: true,
    },
    reportType: {
      type: "string",
      label: "Report Type",
      description: "The type of this report.",
      options: constants.REPORT_TYPE_OPTIONS,
    },
    timePeriodColumn: {
      type: "string",
      label: "Time Period Column",
      description: "Include a time period column to introduce comparison columns in the report for each generated period. For example, set to `QUARTERS` here to have a column for each quarter present in the primary date range. If `PREVIOUS PERIOD` is specified in **Comparison Date Range**, then each quarter column will also include comparison values for its relative previous quarter.",
      optional: true,
      options: constants.TIME_PERIOD_COLUMN_OPTIONS,
    },
    flags: {
      type: "string[]",
      label: "Flags",
      description: "List of flags for this report. Used to flag rows in a result set based on a set of defined filters. Each row must be formatted as a JSON object. [See the documentation](https://developers.google.com/ad-manager/api/beta/reference/rest/v1/networks.reports#Flag).",
      optional: true,
    },
    sorts: {
      type: "string[]",
      label: "Sorts",
      description: "Default sorts to apply to this report. Each row must be formatted as a JSON object. [See the documentation](https://developers.google.com/ad-manager/api/beta/reference/rest/v1/networks.reports#Sort).",
      optional: true,
    },
    dateRange: {
      type: "string",
      label: "Date Range Type",
      description: "The date range of this report.",
      options: Object.values(constants.DATE_RANGE_TYPE),
      reloadProps: true,
    },
    comparisonDateRange: {
      type: "string",
      label: "Comparison Date Range Type",
      description: "The comparison date range of this report. If unspecified, the report will not have any comparison metrics.",
      optional: true,
      options: Object.values(constants.DATE_RANGE_TYPE),
      reloadProps: true,
    },
  },
  methods: {
    createReport({
      parent, ...args
    } = {}) {
      return this.app.post({
        path: `/${parent}/reports`,
        ...args,
      });
    },
    getComparisonDateRangeProps() {
      const { comparisonDateRange } = this;
      if (comparisonDateRange === constants.DATE_RANGE_TYPE.FIXED) {
        return {
          comparisonStartDateYear: {
            type: "integer",
            label: "Comparison Start Date Year",
            description: "Year of the date. Must be from `1` to `9999`, or `0` to specify a date without a year.",
          },
          comparisonStartDateMonth: {
            type: "integer",
            label: "Comparison Start Date Month",
            description: "Month of a year. Must be from `1` to `12`, or `0` to specify a year without a month and day.",
          },
          comparisonStartDateDay: {
            type: "integer",
            label: "Comparison Start Date Day",
            description: "Day of a month. Must be from `1` to `31` and valid for the year and month, or `0` to specify a year by itself or a year and month where the day isn't significant.",
          },
          comparisonEndDateYear: {
            type: "integer",
            label: "Comparison End Date Year",
            description: "Year of the date. Must be from `1` to `9999`, or `0` to specify a date without a year.",
          },
          comparisonEndDateMonth: {
            type: "integer",
            label: "Comparison End Date Month",
            description: "Month of a year. Must be from `1` to `12`, or `0` to specify a year without a month and day.",
          },
          comparisonEndDateDay: {
            type: "integer",
            label: "Comparison End Date Day",
            description: "Day of a month. Must be from `1` to `31` and valid for the year and month, or `0` to specify a year by itself or a year and month where the day isn't significant.",
          },
        };
      } else if (comparisonDateRange === constants.DATE_RANGE_TYPE.RELATIVE) {
        return {
          comparisonRelative: {
            type: "string",
            label: "Comparison Relative Date Range",
            description: "The relative date range of this report.",
            options: Object.values(relativeDateRanges),
          },
        };
      }
    },
    getDateRangeValues() {
      const {
        dateRange,
        relative,
        startDateYear,
        startDateMonth,
        startDateDay,
        endDateYear,
        endDateMonth,
        endDateDay,
      } = this;

      if (dateRange === constants.DATE_RANGE_TYPE.FIXED) {
        return {
          dateRange: {
            fixed: {
              startDate: {
                year: startDateYear,
                month: startDateMonth,
                day: startDateDay,
              },
              endDate: {
                year: endDateYear,
                month: endDateMonth,
                day: endDateDay,
              },
            },
          },
        };
      }
      return {
        dateRange: {
          relative,
        },
      };
    },
    getComparisonDateRangeValues() {
      const {
        comparisonDateRange,
        comparisonRelative,
        comparisonStartDateYear,
        comparisonStartDateMonth,
        comparisonStartDateDay,
        comparisonEndDateYear,
        comparisonEndDateMonth,
        comparisonEndDateDay,
      } = this;

      if (comparisonDateRange === constants.DATE_RANGE_TYPE.FIXED) {
        return {
          comparisonDateRange: {
            fixed: {
              startDate: {
                year: comparisonStartDateYear,
                month: comparisonStartDateMonth,
                day: comparisonStartDateDay,
              },
              endDate: {
                year: comparisonEndDateYear,
                month: comparisonEndDateMonth,
                day: comparisonEndDateDay,
              },
            },
          },
        };
      } else if (comparisonDateRange === constants.DATE_RANGE_TYPE.RELATIVE) {
        return {
          comparisonDateRange: {
            relative: comparisonRelative,
          },
        };
      }
    },
  },
  additionalProps() {
    const { dateRange } = this;

    if (dateRange === "fixed") {
      return {
        startDateYear: {
          type: "integer",
          label: "Start Date Year",
          description: "Year of the date. Must be from `1` to `9999`, or `0` to specify a date without a year.",
        },
        startDateMonth: {
          type: "integer",
          label: "Start Date Month",
          description: "Month of a year. Must be from `1` to `12`, or `0` to specify a year without a month and day.",
        },
        startDateDay: {
          type: "integer",
          label: "Start Date Day",
          description: "Day of a month. Must be from `1` to `31` and valid for the year and month, or `0` to specify a year by itself or a year and month where the day isn't significant.",
        },
        endDateYear: {
          type: "integer",
          label: "End Date Year",
          description: "Year of the date. Must be from `1` to `9999`, or `0` to specify a date without a year.",
        },
        endDateMonth: {
          type: "integer",
          label: "End Date Month",
          description: "Month of a year. Must be from `1` to `12`, or `0` to specify a year without a month and day.",
        },
        endDateDay: {
          type: "integer",
          label: "End Date Day",
          description: "Day of a month. Must be from `1` to `31` and valid for the year and month, or `0` to specify a year by itself or a year and month where the day isn't significant.",
        },
        ...this.getComparisonDateRangeProps(),
      };
    }

    return {
      relative: {
        type: "string",
        label: "Relative Date Range",
        description: "The relative date range of this report.",
        options: Object.values(relativeDateRanges),
      },
      ...this.getComparisonDateRangeProps(),
    };
  },
  async run({ $ }) {
    const {
      getDateRangeValues,
      getComparisonDateRangeValues,
      createReport,
      parent,
      name,
      visibility,
      displayName,
      scheduleOptions,
      dimensions,
      metrics,
      filters,
      timeZone,
      currencyCode,
      customDimensionKeyIds,
      lineItemCustomFieldIds,
      orderCustomFieldIds,
      creativeCustomFieldIds,
      reportType,
      timePeriodColumn,
      flags,
      sorts,
    } = this;

    const response = await createReport({
      $,
      parent,
      data: {
        name,
        visibility,
        displayName,
        scheduleOptions,
        reportDefinition: {
          dimensions,
          metrics,
          filters: utils.parseArray(filters),
          timeZone,
          currencyCode,
          customDimensionKeyIds,
          lineItemCustomFieldIds,
          orderCustomFieldIds,
          creativeCustomFieldIds,
          reportType,
          timePeriodColumn,
          flags: utils.parseArray(flags),
          sorts: utils.parseArray(sorts),
          ...getDateRangeValues(),
          ...getComparisonDateRangeValues(),
        },
      },
    });

    $.export("$summary", `Successfully created report in network ${parent}`);
    return response;
  },
};
