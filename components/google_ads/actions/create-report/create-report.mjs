import common from "../common/common.mjs";
import { adGroup } from "../../common/resources/adGroup.mjs";
import { ad } from "../../common/resources/ad.mjs";
import { campaign } from "../../common/resources/campaign.mjs";
import { customer } from "../../common/resources/customer.mjs";
import { ConfigurationError } from "@pipedream/platform";

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
  description: "Generates a report from your Google Ads data. [See the documentation](https://developers.google.com/google-ads/api/fields/v16/overview)",
  version: "0.0.2",
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
        content: `[See the documentation](https://developers.google.com/google-ads/api/fields/v16/${value}) for more information on available fields, segments and metrics.`,
      },
      fields: {
        type: "string[]",
        label: "Fields",
        description: `${label} data fields to obtain`,
        options: resource.fields,
        optional: true,
        reloadProps: true,
      },
      segments: {
        type: "string[]",
        label: "Segments",
        description: `${label} segments to obtain [more info on the documentation](https://developers.google.com/google-ads/api/fields/v16/segments)`,
        options: resource.segments,
        optional: true,
        reloadProps: true,
      },
      metrics: {
        type: "string[]",
        label: "Metrics",
        description: `${label} metrics to obtain [more info on the documentation](https://developers.google.com/google-ads/api/fields/v16/metrics)`,
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
    buildQuery() {
      const {
        resource, limit, orderBy, direction,
      } = this;
      const fields = this.fields?.map((i) => `${resource}.${i}`) ?? [];
      const segments = this.segments?.map((i) => `segments.${i}`) ?? [];
      const metrics = this.metrics?.map((i) => `metrics.${i}`) ?? [];
      const selection = [
        ...fields,
        ...segments,
        ...metrics,
      ];

      if (!selection.length) {
        throw new ConfigurationError("Select at least one field, segment or metric.");
      }

      let query = `SELECT ${selection.join(", ")} FROM ${resource}`;
      if (orderBy && direction) {
        query += ` ORDER BY ${`${resource}.${orderBy}`} ${direction}`;
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

    $.export("$summary", `Sucessfully obtained ${length} result${length === 1
      ? ""
      : "s"}`);
    return {
      query,
      results,
    };
  },
};
