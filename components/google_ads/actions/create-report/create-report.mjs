import common from "../common/common.mjs";
import { adGroup } from "../../common/resources/adGroup.mjs";
import { ad } from "../../common/resources/ad.mjs";
import { campaign } from "../../common/resources/campaign.mjs";
import { customer } from "../../common/resources/customer.mjs";
import { ConfigurationError } from "@pipedream/platform";
import { DATE_RANGE_OPTIONS } from "./common-constants.mjs";
import { checkPrefix } from "../../common/utils.mjs";

const RESOURCES = [
  adGroup,
  ad,
  campaign,
  customer,
];

export default {
  ...common,
  key: "google_ads-create-report",
  name: "Create Report",
  description: "Generates a report from your Google Ads data. [See the documentation](https://developers.google.com/google-ads/api/reference/rpc/v21/GoogleAdsService/Search?transport=rest)",
  version: "0.1.3",
  type: "action",
  props: {
    ...common.props,
    resource: {
      type: "string",
      label: "Resource",
      description: "The resource to generate a report for.",
      options: RESOURCES.map((r) => r.resourceOption),
      reloadProps: true,
    },
  },
  additionalProps() {
    const resource = RESOURCES.find((r) => r.resourceOption.value === this.resource);
    if (!resource) throw new ConfigurationError("Select one of the available resources.");

    const {
      label, value,
    } = resource.resourceOption;

    return {
      docsAlert: {
        type: "alert",
        alertType: "info",
        content: `[See the documentation](https://developers.google.com/google-ads/api/fields/v21/${value}) for more information on available fields, segments and metrics.`,
      },
      objectFilter: {
        type: "string[]",
        label: `Filter by ${label}s`,
        description: `Select the ${label}s to generate a report for (or leave blank for all ${label}s)`,
        optional: true,
        useQuery: true,
        options: async ({
          query, prevContext: { nextPageToken: pageToken },
        }) => {
          const {
            accountId, customerClientId, resource,
          } = this;
          const {
            results, nextPageToken,
          } = await this.googleAds.listResources({
            accountId,
            customerClientId,
            resource,
            query,
            pageToken,
          });
          const options = results?.map?.((item) => this.getResourceOption(item, resource));
          return {
            options,
            context: {
              nextPageToken,
            },
          };
        },
      },
      dateRange: {
        type: "string",
        label: "Date Range",
        description: "Select a date range for the report",
        options: DATE_RANGE_OPTIONS,
        optional: true,
        reloadProps: true,
      },
      ...(this.dateRange === "CUSTOM" && {
        startDate: {
          type: "string",
          label: "Start Date",
          description: "The start date, in `YYYY-MM-DD` format",
        },
        endDate: {
          type: "string",
          label: "End Date",
          description: "The end date, in `YYYY-MM-DD` format",
        },
      }),
      fields: {
        type: "string[]",
        label: "Fields",
        description: "Select any fields you want to include in your report.",
        options: resource.fields,
        optional: true,
        reloadProps: true,
      },
      segments: {
        type: "string[]",
        label: "Segments",
        description: "Select any segments you want to include in your report. See the documentation [here](https://developers.google.com/google-ads/api/reference/rpc/v21/Segments)",
        options: resource.segments,
        default: [
          "segments.date",
        ],
        optional: true,
        reloadProps: true,
      },
      metrics: {
        type: "string[]",
        label: "Metrics",
        description: "Select any metrics you want to include in your report. See the documentation [here](https://developers.google.com/google-ads/api/reference/rpc/v21/Metrics)",
        options: resource.metrics,
        optional: true,
        reloadProps: true,
      },
      orderBy: {
        type: "string",
        label: "Order By",
        description: "The field to order the results by",
        optional: true,
        options: [
          this.fields,
          this.segments,
          this.metrics,
        ].filter((v) => v).flatMap((value) => {
          let returnValue = value;
          if (typeof value === "string") {
            try {
              returnValue = JSON.parse(value);
            } catch (err) {
              returnValue = value.split(",");
            }
          }
          return returnValue?.map?.((str) => str.trim());
        }),
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
    };
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
