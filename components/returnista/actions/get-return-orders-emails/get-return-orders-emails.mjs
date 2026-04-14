import returnista from "../../returnista.app.mjs";

export default {
  key: "returnista-get-return-orders-emails",
  name: "Get Return Orders Emails",
  description: "Returns the emails related to return a order. [See the documentation](https://platform.returnista.com/reference/rest-api/#get-/account/-accountId/return-orders/emails)",
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
    const { data: response } = await this.returnista.getReturnOrdersEmails({
      $,
      accountId: this.accountId,
      returnOrderId: this.returnOrderId,
    });

    $.export("$summary", `Successfully retrieved ${response.length} return orders emails`);
    return response;
  },
};
