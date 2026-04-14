import returnista from "../../returnista.app.mjs";

export default {
  key: "returnista-get-return-order-emails",
  name: "Get Return Order Emails",
  description: "Returns emails related to a return order. [See the documentation](https://platform.returnista.com/reference/rest-api/#get-/account/-accountId/return-orders/emails)",
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
    const { data: response } = await this.returnista.getReturnOrderEmails({
      $,
      accountId: this.accountId,
      returnOrderId: this.returnOrderId,
    });

    $.export("$summary", `Successfully retrieved ${response.length} return order emails`);
    return response;
  },
};
