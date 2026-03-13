import common from "../common/common.mjs";
import { ConfigurationError } from "@pipedream/platform";
import { DATE_RANGE_OPTIONS } from "./common-constants.mjs";
import { checkPrefix } from "../../common/utils.mjs";

export default {
  ...common,
  key: "google_ads-create-report",
  name: "Create Report",
  description: "Generates a report from your Google Ads data. [See the documentation](https://developers.google.com/google-ads/api/reference/rpc/v21/GoogleAdsService/Search?transport=rest)",
  version: "0.1.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    resource: {
      propDefinition: [
        common.props.googleAds,
        "resource",
      ],
    },
    objectFilter: {
      propDefinition: [
        common.props.googleAds,
        "objectFilter",
        ({
          accountId, customerClientId, resource,
        }) => ({
          accountId,
          customerClientId,
          resource,
        }),
      ],
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
      label: "Start Date",
      description: "The start date, in `YYYY-MM-DD` format. Only applies when Date Range is set to 'CUSTOM'.",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The end date, in `YYYY-MM-DD` format. Only applies when Date Range is set to 'CUSTOM'.",
      optional: true,
    },
    fields: {
      propDefinition: [
        common.props.googleAds,
        "reportFields",
        ({ resource }) => ({
          resource,
        }),
      ],
    },
    segments: {
      propDefinition: [
        common.props.googleAds,
        "reportSegments",
        ({ resource }) => ({
          resource,
        }),
      ],
    },
    metrics: {
      propDefinition: [
        common.props.googleAds,
        "reportMetrics",
        ({ resource }) => ({
          resource,
        }),
      ],
    },
    orderBy: {
      propDefinition: [
        common.props.googleAds,
        "reportOrderBy",
        ({
          fields, segments, metrics,
        }) => ({
          reportFields: fields,
          reportSegments: segments,
          reportMetrics: metrics,
        }),
      ],
    },
    direction: {
      type: "string",
      label: "Direction",
      description: "The direction to order the results by, if `Order By` is specified",
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
        resource, fields, segments, metrics, limit, orderBy, direction, objectFilter, dateRange,
      } = this;

      const filteredSegments = dateRange
        ? segments
        : segments?.filter((i) => i !== "segments.date");

      const selection = [
        ...checkPrefix(fields, resource),
        ...checkPrefix(filteredSegments, "segments"),
        ...checkPrefix(metrics, "metrics"),
      ];

      if (!selection.length) {
        throw new ConfigurationError("Select at least one field, segment or metric.");
      }

      let query = `SELECT ${selection.join(", ")} FROM ${resource}`;
      if (objectFilter) {
        query += ` WHERE ${resource === "ad_group_ad"
          ? "ad_group_ad.ad"
          : resource}.id IN (${objectFilter.join?.(", ") ?? objectFilter})`;
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
