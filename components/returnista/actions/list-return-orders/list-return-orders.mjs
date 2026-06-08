import returnista from "../../returnista.app.mjs";

export default {
  key: "returnista-list-return-orders",
  name: "List Return Orders",
  description: "Lists and searches return orders for an account, with support for filtering, searching, sorting, pagination, and response expansion."
    + " Use this tool to find return orders by status, purchase order number, consumer name, or date range."
    + " This tool replaces both get-return-orders and get-draft-return-orders — do NOT use those legacy tools."
    + " To list draft return orders specifically, set the `filter` parameter to `status:draft`."
    + " To accept or reject a draft return order, use **Process Draft Return Order** with the order ID."
    + " To get full details of a specific order (including shipments and consumer info), use the returned ID with **Get Return Order**."
    + " Filter syntax: use `:` for equality (`purchaseOrderNumber:12345`, `status:draft`), and `>`, `<`, `>=`, `<=` for dates (`createdAt>2024-01-01T00:00:00Z`)."
    + " [See the documentation](https://platform.returnista.com/reference/rest-api/#get-/account/-accountId/return-orders)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    returnista,
    accountId: {
      propDefinition: [
        returnista,
        "accountId",
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
    expand: {
      propDefinition: [
        returnista,
        "expand",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.returnista.getReturnOrders({
      $,
      accountId: this.accountId,
      params: {
        filter: this.filter,
        search: this.search,
        sortBy: this.sortBy,
        orderBy: this.orderBy,
        limit: this.limit,
        page: this.page,
        expand: this.expand,
      },
    });
    const orders = response?.data ?? [];
    $.export("$summary", `Retrieved ${orders.length} return order(s)`);
    return response;
  },
};
