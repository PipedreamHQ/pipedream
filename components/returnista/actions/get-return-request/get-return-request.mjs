import returnista from "../../returnista.app.mjs";

export default {
  key: "returnista-get-return-request",
  name: "Get Return Request",
  description: "Gets the full details of a single return request by ID."
    + " Return requests contain item-level information: purchase order number, return reason, requested resolution (refund, exchange, etc.)."
    + " To find a return request ID, use **List Return Requests** first."
    + " [See the documentation](https://platform.returnista.com/reference/rest-api/#get-/account/-accountId-/return-request/-id-)",
  version: "0.0.2",
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
    returnRequestId: {
      propDefinition: [
        returnista,
        "returnRequestId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.returnista.getReturnRequest({
      $,
      accountId: this.accountId,
      returnRequestId: this.returnRequestId,
    });
    $.export("$summary", `Successfully retrieved return request ${this.returnRequestId}`);
    return response;
  },
};
