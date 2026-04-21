import returnista from "../../returnista.app.mjs";

export default {
  key: "returnista-get-return-order",
  name: "Get Return Order",
  description: "Gets a return order by ID. [See the documentation](https://platform.returnista.com/reference/rest-api/#get-/account/-accountId/return-order/-id)",
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
    returnOrderId: {
      propDefinition: [
        returnista,
        "returnOrderId",
        ({ accountId }) => ({
          accountId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.returnista.getReturnOrder({
      $,
      accountId: this.accountId,
      returnOrderId: this.returnOrderId,
    });
    $.export("$summary", `Successfully retrieved return order ${this.returnOrderId}`);
    return response;
  },
};
