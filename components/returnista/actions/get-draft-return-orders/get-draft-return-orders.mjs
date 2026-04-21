import returnista from "../../returnista.app.mjs";
import getReturnOrders from "../get-return-orders/get-return-orders.mjs";

export default {
  ...getReturnOrders,
  key: "returnista-get-draft-return-orders",
  name: "Get Draft Return Orders",
  description: "Gets a list of draft return orders for the given account. [See the documentation](https://platform.returnista.com/reference/rest-api/#get-/account/-accountId-/draft-return-orders)",
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
    const { data: response } = await this.returnista.getDraftReturnOrders({
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
    $.export("$summary", `Successfully retrieved ${response.length} draft return orders`);
    return response;
  },
};
