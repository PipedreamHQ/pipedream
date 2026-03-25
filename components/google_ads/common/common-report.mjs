import { ConfigurationError } from "@pipedream/platform";
import googleAds from "../google_ads.app.mjs";
import props from "./props.mjs";
import { DATE_RANGE_OPTIONS } from "./constants.mjs";
import { checkPrefix } from "./utils.mjs";

export function createReportComponent(resource) {
  const {
    label, value,
  } = resource.resourceOption;

  return {
    props: {
      ...props,
      docsAlert: {
        type: "alert",
        alertType: "info",
        content: `[See the documentation](https://developers.google.com/google-ads/api/fields/v21/${value}) for more information on available fields, segments and metrics.`,
      },
      objectFilter: {
        propDefinition: [
          googleAds,
          "reportResourceFilter",
          ({
            accountId, customerClientId,
          }) => ({
            accountId,
            customerClientId,
            resource: value,
          }),
        ],
        label: `${label}(s)`,
        description: `Select the ${label}(s) to generate a report for (or leave blank for all ${label}s)`,
      },
      dateRange: {
        type: "string",
        label: "Date Range",
        description: "Select a date range for the report",
        options: DATE_RANGE_OPTIONS,
        optional: true,
      },
      startDate: {
        type: "string",
        label: "Custom Start Date",
        description: "If using a custom date range, this is the start date in `YYYY-MM-DD` format",
        optional: true,
      },
      endDate: {
        type: "string",
        label: "Custom End Date",
        description: "If using a custom date range, this is the end date in `YYYY-MM-DD` format",
        optional: true,
      },
      fields: {
        type: "string[]",
        label: `${label} Fields`,
        description: `Select the ${label} fields to include in the report`,
        options: resource.fields,
        optional: true,
      },
      segments: {
        type: "string[]",
        label: "Segments",
        description: "Select any segments to include in the report. See the documentation [here](https://developers.google.com/google-ads/api/reference/rpc/v21/Segments)",
        options: resource.segments,
        default: [
          "segments.date",
        ],
        optional: true,
      },
      metrics: {
        type: "string[]",
        label: "Metrics",
        description: "Select any metrics to include in the report. See the documentation [here](https://developers.google.com/google-ads/api/reference/rpc/v21/Metrics)",
        options: resource.metrics,
        optional: true,
      },
      orderBy: {
        propDefinition: [
          googleAds,
          "reportOrderBy",
          ({
            fields, segments, metrics,
          }) => ({
            fields,
            segments,
            metrics,
          }),
        ],
      },
      direction: {
        type: "string",
        label: "Direction",
        description: "If **Order By** is specified, this is the direction to order the results by",
        optional: true,
        options: [
          {
            label: "Ascending",
            value: "ASC",
          },
          {
            label: "Descending",
            value: "DESC",
          },
        ],
        default: "ASC",
      },
      limit: {
        type: "integer",
        label: "Limit",
        description: "The maximum number of results to return",
        optional: true,
      },
    },
    methods: {
      buildQuery() {
        const {
          fields, segments, metrics, limit, orderBy, direction, objectFilter, dateRange,
        } = this;

        const filteredSegments = dateRange
          ? segments
          : segments?.filter((i) => i !== "segments.date");

        const selection = [
          ...checkPrefix(fields, value),
          ...checkPrefix(filteredSegments, "segments"),
          ...checkPrefix(metrics, "metrics"),
        ];

        if (!selection.length) {
          throw new ConfigurationError("Select at least one field, segment or metric.");
        }

        if (dateRange === "CUSTOM" && (!this.startDate || !this.endDate)) {
          throw new ConfigurationError("Both **Custom Start Date** and **Custom End Date** are required when using a custom date range.");
        }

        let query = `SELECT ${selection.join(", ")} FROM ${value}`;
        if (objectFilter?.length) {
          query += ` WHERE ${value === "ad_group_ad"
            ? "ad_group_ad.ad"
            : value}.id IN (${objectFilter.join?.(", ") ?? objectFilter})`;
        }
        if (dateRange) {
          const dateClause = dateRange === "CUSTOM"
            ? `BETWEEN '${this.startDate}' AND '${this.endDate}'`
            : `DURING ${dateRange}`;
          query += ` ${objectFilter
            ? "AND"
            : "WHERE"} segments.date ${dateClause}`;
        }

        if (orderBy && direction) {
          query += ` ORDER BY ${orderBy} ${direction}`;
        }
        if (limit) {
          query += ` LIMIT ${limit}`;
        }

        return query;
      },
    },
    async run({ $ }) {
      const query = this.buildQuery();
      const results = (await this.googleAds.createReport({
        $,
        accountId: this.accountId,
        customerClientId: this.customerClientId,
        data: {
          query,
        },
      })) ?? [];

      const { length } = results;

      $.export("$summary", `Successfully obtained ${length} result${length === 1
        ? ""
        : "s"}`);
      return {
        query,
        results,
      };
    },
  };
}
