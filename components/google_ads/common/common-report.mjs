import { ConfigurationError } from "@pipedream/platform";
import googleAds from "../google_ads.app.mjs";
import props from "./props.mjs";
import {
  CORE_DATE_SEGMENTS, DATE_RANGE_OPTIONS,
} from "./constants.mjs";
import { checkPrefix } from "./utils.mjs";

export function createReportComponent(resource) {
  const {
    label, value,
  } = resource.resourceOption;

  // Build allow-lists for local pre-flight validation (no HTTP call consumed)
  const validFields = new Set(resource.fields.map((f) => f.value));
  const validSegments = new Set(resource.segments.map((s) => s.value));
  const validMetrics = new Set(resource.metrics.map((m) => m.value));

  return {
    props: {
      ...props,
      docsAlert: {
        type: "alert",
        alertType: "info",
        content: `[See the documentation](https://developers.google.com/google-ads/api/fields/v25/${value}) for more information on available fields, segments and metrics.`,
      },
      objectFilter: {
        propDefinition: [
          googleAds,
          "reportResourceFilter",
        ],
        label: `${label}(s)`,
        description: `Numeric ${label} IDs to filter this report to specific ${label.toLowerCase()}s. Run the relevant list action first to discover valid IDs (e.g. **List Campaigns** for campaign reports, **List Ad Groups** for ad group reports). Leave blank for all ${label.toLowerCase()}s.`,
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
        description: `Array of ${label} field names to include in the report (e.g. \`["${value}.id", "${value}.name"]\`). Invalid names throw a ConfigurationError before any API call. [See the field reference](https://developers.google.com/google-ads/api/fields/v25/${value})`,
        options: resource.fields,
        optional: true,
      },
      segments: {
        type: "string[]",
        label: "Segments",
        description: "Array of segment names to break the report down by (e.g. `[\"segments.date\"]`). Empty by default so date segmentation is opt-in - adding date segments multiplies row counts by the number of days in the range. [See the documentation](https://developers.google.com/google-ads/api/reference/rpc/v25/Segments)",
        options: resource.segments,
        optional: true,
      },
      metrics: {
        type: "string[]",
        label: "Metrics",
        description: "Array of metric names to include in the report (e.g. `[\"metrics.clicks\", \"metrics.impressions\"]`). Invalid names throw a ConfigurationError before any API call. [See the documentation](https://developers.google.com/google-ads/api/reference/rpc/v25/Metrics)",
        options: resource.metrics,
        optional: true,
      },
      orderBy: {
        type: "string",
        label: "Order By",
        description: "Free-form GAQL ORDER BY clause including direction (e.g. `metrics.impressions DESC` or `campaign.name ASC`).",
        optional: true,
      },
      limit: {
        type: "integer",
        label: "Limit",
        description: "Maximum number of rows to return (min 1, max 1000).",
        optional: true,
        min: 1,
        max: 1000,
      },
    },
    methods: {
      buildQuery() {
        const {
          fields, segments, metrics, limit, orderBy, objectFilter, dateRange,
        } = this;

        const expandedFields = checkPrefix(fields, value);
        // Expand the prefix before filtering: CORE_DATE_SEGMENTS holds fully-qualified
        // names (e.g. `segments.date`), so comparing against the raw, possibly-bare
        // segment input would let an unprefixed "date" slip through unfiltered.
        const allExpandedSegments = checkPrefix(segments, "segments");
        const expandedSegments = dateRange
          ? allExpandedSegments
          : allExpandedSegments?.filter((s) => !CORE_DATE_SEGMENTS.includes(s));
        const expandedMetrics = checkPrefix(metrics, "metrics");

        // Validate against resource allow-lists - throws ConfigurationError before any HTTP call
        for (const f of expandedFields) {
          if (!validFields.has(f)) {
            throw new ConfigurationError(`"${f}" is not a valid field for the ${label} resource. See https://developers.google.com/google-ads/api/fields/v25/${value}`);
          }
        }
        for (const s of expandedSegments) {
          if (!validSegments.has(s)) {
            throw new ConfigurationError(`"${s}" is not a valid segment for the ${label} resource. See https://developers.google.com/google-ads/api/reference/rpc/v25/Segments`);
          }
        }
        for (const m of expandedMetrics) {
          if (!validMetrics.has(m)) {
            throw new ConfigurationError(`"${m}" is not a valid metric for the ${label} resource. See https://developers.google.com/google-ads/api/reference/rpc/v25/Metrics`);
          }
        }

        const selection = [
          ...expandedFields,
          ...expandedSegments,
          ...expandedMetrics,
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
          query += ` ${objectFilter?.length
            ? "AND"
            : "WHERE"} segments.date ${dateClause}`;
        }

        if (orderBy) {
          query += ` ORDER BY ${orderBy}`;
        }
        if (limit) {
          query += ` LIMIT ${limit}`;
        }

        return query;
      },
    },
    async run({ $ }) {
      const query = this.buildQuery();
      const results = (await this.googleAds.searchStream({
        $,
        accountId: this.accountId,
        customerClientId: this.customerClientId,
        query,
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
