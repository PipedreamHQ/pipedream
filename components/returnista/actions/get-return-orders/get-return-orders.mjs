import returnista from "../../returnista.app.mjs";

export default {
  key: "returnista-get-return-orders",
  name: "Get Return Orders",
  description: "Gets a list of return orders for the given account. [See the documentation](https://platform.returnista.com/reference/rest-api/#get-/account/-accountId/return-orders)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    returnista,
    accountId: {
      propDefinition: [
        returnista,
        "accountId",
      ],
    },
    limit: {
      propDefinition: [
        returnista,
        "limit",
      ],
    },
    page: {
      propDefinition: [
        returnista,
        "page",
      ],
    },
    filter: {
      propDefinition: [
        returnista,
        "filter",
      ],
    },
    search: {
      propDefinition: [
        returnista,
        "search",
      ],
    },
    sortBy: {
      propDefinition: [
        returnista,
        "sortBy",
      ],
    },
    orderBy: {
      propDefinition: [
        returnista,
        "orderBy",
      ],
    },
  },
  async run({ $ }) {
    const { data: response } = await this.returnista.getReturnOrders({
      $,
      accountId: this.accountId,
      params: {
        limit: this.limit,
        page: this.page,
        filter: this.filter,
        search: this.search,
        sortBy: this.sortBy,
        orderBy: this.orderBy,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.length} return orders`);
    return response;
  },
};
