import app from "../../commerce_tools.app.mjs";
import utils from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "commerce_tools-search-orders",
  name: "Search Orders",
  description: "Search Orders using the Order Search API. The endpoint must be [activated](https://docs.commercetools.com/api/projects/order-search#activation-of-the-api) for your Project. [See the documentation](https://docs.commercetools.com/api/projects/order-search#search-orders).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    query: {
      type: "object",
      label: "Query",
      description: "The [Order search query](https://docs.commercetools.com/api/projects/order-search#ordersearchquery) as a JSON object. For example: `{ \"exact\": { \"field\": \"orderState\", \"value\": \"Open\" } }`.",
    },
    sort: {
      type: "string[]",
      label: "Sort",
      description: "An array of [OrderSearchSorting](https://docs.commercetools.com/api/projects/order-search#ordersearchsorting) objects (each as a JSON string) controlling how results are sorted. For example: `[\"{ \\\"field\\\": \\\"createdAt\\\", \\\"order\\\": \\\"desc\\\" }\"]`.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `The maximum number of search results to return (max ${constants.SEARCH_MAX_LIMIT}).`,
      min: 0,
      max: constants.SEARCH_MAX_LIMIT,
      default: constants.SEARCH_DEFAULT_LIMIT,
      optional: true,
    },
    offset: {
      propDefinition: [
        app,
        "offset",
      ],
      description: "The number of search results to skip (for pagination).",
    },
  },
  async run({ $ }) {
    const response = await this.app.searchOrders({
      $,
      data: {
        query: utils.parseObject(this.query),
        sort: utils.parseObject(this.sort),
        limit: this.limit,
        offset: this.offset,
      },
    });
    $.export("$summary", `Successfully found ${response.hits?.length ?? 0} Order(s)`);
    return response;
  },
};
