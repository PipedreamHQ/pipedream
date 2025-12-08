import app from "../../woocommerce.app.mjs";

export default {
  key: "woocommerce-list-orders",
  name: "List Orders",
  description: "Retrieve a list of orders. [See the docs](https://woocommerce.github.io/woocommerce-rest-api-docs/#list-all-orders)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    search: {
      propDefinition: [
        app,
        "search",
      ],
    },
    orderStatus: {
      propDefinition: [
        app,
        "orderStatus",
      ],
    },
    customer: {
      propDefinition: [
        app,
        "customer",
      ],
      optional: true,
    },
    after: {
      type: "string",
      label: "After",
      description: "Limit response to resources published after a given ISO8601 compliant date (e.g., `2023-01-01T00:00:00`)",
      optional: true,
    },
    before: {
      type: "string",
      label: "Before",
      description: "Limit response to resources published before a given ISO8601 compliant date (e.g., `2023-12-31T23:59:59`)",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const {
      maxResults,
      search,
      orderStatus,
      customer,
      after,
      before,
    } = this;

    const params = {
      page: 1,
      per_page: 10,
      ...Object.fromEntries(
        Object.entries({
          search,
          status: orderStatus,
          customer,
          after,
          before,
        }).filter(([
          ,
          v,
        ]) => v),
      ),
    };

    const orders = [];
    let results;
    do {
      results = await this.app.listOrders(params);
      orders.push(...results);
      params.page += 1;
    } while (results.length === params.per_page && orders.length < maxResults);

    if (orders.length > maxResults) {
      orders.length = maxResults;
    }

    $.export("$summary", `Successfully retrieved ${orders.length} order(s)`);

    return orders;
  },
};
