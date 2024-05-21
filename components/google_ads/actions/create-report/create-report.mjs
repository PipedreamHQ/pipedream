import common from "../common/common.mjs";
import { adGroup } from "./resource_adGroup.mjs";
import { ad } from "./resource_ad.mjs";
import { campaign } from "./resource_campaign.mjs";
import { customer } from "./resource_customer.mjs";
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
  version: "0.0.1",
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
      },
      segments: {
        type: "string[]",
        label: "Segments",
        description: `${label} segments to obtain [more info on the documentation](https://developers.google.com/google-ads/api/fields/v16/segments)`,
        options: resource.segments,
      },
      metrics: {
        type: "string[]",
        label: "Metrics",
        description: `${label} metrics to obtain [more info on the documentation](https://developers.google.com/google-ads/api/fields/v16/metrics)`,
        options: resource.metrics,
      },
    };
  },
  methods: {
    buildQuery() {
      const {
        resource, limit, orderBy, direction,
      } = this;
      const fields = this.fields.map((i) => `${resource}.${i}`);
      const segments = this.segments.map((i) => `segments.${i}`);
      const metrics = this.metrics.map((i) => `metrics.${i}`);
      const selection = [
        ...fields,
        ...segments,
        ...metrics,
      ].join(", ");

      let query = `SELECT ${selection} FROM ${resource}`;
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
    const response = await this.googleAds.createReport({
      $,
      accountId: this.accountId,
      customerClientId: this.customerClientId,
      data: {
        query,
      },
    });

    $.export("$summary", "Created report");
    return response;
  },
};
