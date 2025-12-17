import optimoroute from "../../optimoroute.app.mjs";

export default {
  key: "optimoroute-search-orders",
  name: "Search Orders",
  description: "Search for orders in Optimoroute. [See the documentation](https://optimoroute.com/api/#search-orders)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    optimoroute,
    from: {
      type: "string",
      label: "From",
      description: "From date. YYYY-MM-DD format, for example `2013-12-20`. The range can span at most 35 days, i.e. 5 weeks",
    },
    to: {
      type: "string",
      label: "To",
      description: "To date. YYYY-MM-DD format, for example `2013-12-20`. The range can span at most 35 days, i.e. 5 weeks",
    },
    includeOrderData: {
      type: "boolean",
      label: "Include Order Data",
      description: "Include order data in the response",
      optional: true,
    },
    includeScheduleInformation: {
      type: "boolean",
      label: "Include Schedule Information",
      description: "Include schedule information in the response",
      optional: true,
    },
    afterTag: {
      propDefinition: [
        optimoroute,
        "afterTag",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.optimoroute.searchOrders({
      $,
      data: {
        dateRange: {
          from: this.from,
          to: this.to,
        },
        includeOrderData: this.includeOrderData,
        includeScheduleInformation: this.includeScheduleInformation,
        after_tag: this.afterTag,
      },
    });
    $.export("$summary", `Orders found: ${response?.orders?.length}`);
    return response;
  },
};
