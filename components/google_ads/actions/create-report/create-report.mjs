import common from "../common/common.mjs";
import { adGroup } from "../../common/resources/adGroup.mjs";
import { ad } from "../../common/resources/ad.mjs";
import { campaign } from "../../common/resources/campaign.mjs";
import { customer } from "../../common/resources/customer.mjs";
import { ConfigurationError } from "@pipedream/platform";
import {
  CORE_DATE_SEGMENTS, DATE_RANGE_OPTIONS,
} from "../../common/constants.mjs";
import { checkPrefix } from "../../common/utils.mjs";

const RESOURCES = [
  adGroup,
  ad,
  campaign,
  customer,
];

// Action kept for backwards compatibility - prefer the individual resource-specific actions
export default {
  ...common,
  key: "google_ads-create-report",
  name: "Create Report",
  description: "Run a generic Google Ads GAQL report against a chosen resource using the SearchStream endpoint (returns all rows, no 10,000-row cap). Field/segment/metric names are validated locally before any API call. Use **List Campaigns**/**List Ad Groups**/**List Ad Group Ads** (resource list actions) to discover valid object IDs for the Object Filter. [See the documentation](https://developers.google.com/google-ads/api/reference/rpc/v25/GoogleAdsService/SearchStream?transport=rest)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    ...common.props,
    resource: {
      type: "string",
      label: "Resource",
      description: "The primary GAQL resource to report on (e.g. `campaign`, `customer`, `ad_group_ad`, `ad_group`). Use one of the values shown here or any valid GAQL resource name.",
      options: RESOURCES.map((r) => r.resourceOption),
    },
    objectFilter: {
      type: "string[]",
      label: "Filter by Resources",
      description: "Numeric resource IDs to filter the report by (e.g. `[\"1234567890\", \"9876543210\"]`). Run **List Campaigns**, **List Ad Groups**, or **List Ad Group Ads** first to discover valid IDs. Leave blank to include all resources.",
      optional: true,
    },
    dateRange: {
      type: "string",
      label: "Date Range",
      description: "Predefined Google Ads date range keyword (e.g. `LAST_30_DAYS`, `THIS_MONTH`). For a custom range, use `CUSTOM` with `startDate` and `endDate` in `YYYY-MM-DD` format.",
      options: DATE_RANGE_OPTIONS,
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date in `YYYY-MM-DD` format (e.g. `2024-01-01`). Only relevant if `Date Range` is set to `CUSTOM`.",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The end date in `YYYY-MM-DD` format (e.g. `2024-01-31`). Only relevant if `Date Range` is set to `CUSTOM`.",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Free-form GAQL field names (e.g. `[\"campaign.id\", \"campaign.name\"]`). The resource prefix is added automatically when omitted. Invalid names throw a ConfigurationError before any API call. [See the field reference](https://developers.google.com/google-ads/api/fields/v25/campaign)",
      optional: true,
    },
    segments: {
      type: "string[]",
      label: "Segments",
      description: "Free-form GAQL segment names (e.g. `[\"segments.date\"]`). Empty by default so date segmentation is opt-in - adding date segments multiplies row counts by the number of days in the range. [See the documentation](https://developers.google.com/google-ads/api/reference/rpc/v25/Segments)",
      optional: true,
    },
    metrics: {
      type: "string[]",
      label: "Metrics",
      description: "Free-form GAQL metric names (e.g. `[\"metrics.impressions\", \"metrics.clicks\"]`). The `metrics.` prefix is added automatically when omitted. Invalid names throw a ConfigurationError before any API call. [See the documentation](https://developers.google.com/google-ads/api/reference/rpc/v25/Metrics)",
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
    getResourceOption(item, resource) {
      let label, value;
      switch (resource) {
      case "campaign":
        label = item.campaign.name;
        value = item.campaign.id;
        break;

      case "customer":
        label = item.customer.descriptiveName;
        value = item.customer.id;
        break;

      case "ad_group":
        label = item.adGroup.name;
        value = item.adGroup.id;
        break;

      case "ad_group_ad":
        label = item.adGroupAd.ad.name;
        value = item.adGroupAd.ad.id;
        break;
      }

      return {
        label,
        value,
      };
    },
    buildQuery() {
      const {
        resource, fields, segments, metrics, limit, orderBy, objectFilter, dateRange,
      } = this;

      const expandedFields = checkPrefix(fields, resource);
      // Expand the prefix before filtering: CORE_DATE_SEGMENTS holds fully-qualified
      // names (e.g. `segments.date`), so comparing against the raw, possibly-bare
      // segment input would let an unprefixed "date" slip through unfiltered.
      const allExpandedSegments = checkPrefix(segments, "segments");
      const expandedSegments = dateRange
        ? allExpandedSegments
        : allExpandedSegments?.filter((s) => !CORE_DATE_SEGMENTS.includes(s));
      const expandedMetrics = checkPrefix(metrics, "metrics");

      // Validate against known resource allow-lists when the resource is a known GAQL resource
      const resourceDef = RESOURCES.find((r) => r.resourceOption.value === resource);
      if (resourceDef) {
        const validFields = new Set(resourceDef.fields.map((f) => f.value));
        const validSegments = new Set(resourceDef.segments.map((s) => s.value));
        const validMetrics = new Set(resourceDef.metrics.map((m) => m.value));

        for (const f of expandedFields) {
          if (!validFields.has(f)) {
            throw new ConfigurationError(`"${f}" is not a valid field for the "${resource}" resource. Check the GAQL field reference: https://developers.google.com/google-ads/api/fields/v25/${resource}`);
          }
        }
        for (const s of expandedSegments) {
          if (!validSegments.has(s)) {
            throw new ConfigurationError(`"${s}" is not a valid segment for the "${resource}" resource. Check the GAQL field reference: https://developers.google.com/google-ads/api/fields/v25/${resource}`);
          }
        }
        for (const m of expandedMetrics) {
          if (!validMetrics.has(m)) {
            throw new ConfigurationError(`"${m}" is not a valid metric for the "${resource}" resource. Check the GAQL field reference: https://developers.google.com/google-ads/api/fields/v25/${resource}`);
          }
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

      let query = `SELECT ${selection.join(", ")} FROM ${resource}`;
      if (objectFilter?.length) {
        const invalidIds = objectFilter.filter((id) => !/^\d+$/.test(String(id).trim()));
        if (invalidIds.length) {
          throw new ConfigurationError(`"Filter by Resources" must contain only numeric IDs. Invalid: ${invalidIds.map((id) => `"${id}"`).join(", ")}`);
        }
        query += ` WHERE ${resource === "ad_group_ad"
          ? "ad_group_ad.ad"
          : resource}.id IN (${objectFilter.map((id) => String(id).trim()).join(", ")})`;
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
    if (this.dateRange === "CUSTOM" && (!this.startDate || !this.endDate)) {
      throw new ConfigurationError("Start and end dates are required if using a custom date range.");
    }

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
