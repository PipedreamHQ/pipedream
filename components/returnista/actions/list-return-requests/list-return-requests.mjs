import returnista from "../../returnista.app.mjs";

export default {
  key: "returnista-list-return-requests",
  name: "List Return Requests",
  description: "Lists return requests for an account with optional filtering and pagination."
    + " Return requests are item-level records representing individual products a consumer wants to return (purchase order number, return reason, requested resolution)."
    + " Multiple return requests can belong to a single return order."
    + " To get the full details of a specific return request, use the returned ID with **Get Return Request**."
    + " Filter syntax: use `:` for equality (`purchaseOrderNumber:12345`) and `>`, `<`, `>=`, `<=` for dates (`createdAt>2024-01-01T00:00:00Z`)."
    + " [See the documentation](https://platform.returnista.com/reference/rest-api/#get-/account/-accountId-/return-requests)",
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
  },
  async run({ $ }) {
    const response = await this.returnista.getReturnRequests({
      $,
      accountId: this.accountId,
      params: {
        filter: this.filter,
        limit: this.limit,
        page: this.page,
      },
    });
    const requests = response?.data ?? [];
    $.export("$summary", `Retrieved ${requests.length} return request(s)`);
    return response;
  },
};
