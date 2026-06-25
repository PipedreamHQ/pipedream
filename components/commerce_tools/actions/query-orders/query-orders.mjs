import app from "../../commerce_tools.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "commerce_tools-query-orders",
  name: "Query Orders",
  description: "Retrieve Orders in the Project, optionally filtered and sorted. [See the documentation](https://docs.commercetools.com/api/projects/orders#query-orders).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    where: {
      type: "string[]",
      label: "Where",
      description: "[Query Predicate(s)](https://docs.commercetools.com/api/predicates/query) to filter Orders. Multiple predicates are combined with a logical AND. For example, `orderState=\"Open\"`.",
      optional: true,
    },
    sort: {
      type: "string[]",
      label: "Sort",
      description: "[Sort](https://docs.commercetools.com/api/general-concepts#sorting) expression(s). For example, `lastModifiedAt desc`.",
      optional: true,
    },
    expand: {
      propDefinition: [
        app,
        "expand",
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `The maximum number of Orders to return (max ${constants.MAX_LIMIT}).`,
      min: 1,
      max: constants.MAX_LIMIT,
      default: constants.DEFAULT_LIMIT,
      optional: true,
    },
    offset: {
      propDefinition: [
        app,
        "offset",
      ],
    },
    withTotal: {
      type: "boolean",
      label: "With Total",
      description: "Whether to calculate the `total` number of matching Orders. Set to `false` to improve performance when the total is not needed.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.listOrders({
      $,
      params: {
        where: this.where,
        sort: this.sort,
        expand: this.expand,
        limit: this.limit,
        offset: this.offset,
        withTotal: this.withTotal,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.results?.length ?? 0} Order(s)`);
    return response;
  },
};
