import returnista from "../../returnista.app.mjs";

export default {
  key: "returnista-process-draft-return-order",
  name: "Process Draft Return Order",
  description: "Accepts or rejects a draft return order."
    + " Draft return orders are created when a consumer initiates a return and are pending merchant review."
    + " Set `action` to `accept` to approve the return (this triggers shipment label creation) or `reject` to decline it."
    + " Use **Get Return Orders** with `filter: \"status:draft\"` to find draft order IDs."
    + " [See the documentation](https://platform.returnista.com/reference/rest-api/#put-/account/-accountId/draft-return-order/-id/accept)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    returnista,
    accountId: {
      propDefinition: [
        returnista,
        "accountId",
      ],
    },
    draftReturnOrderId: {
      propDefinition: [
        returnista,
        "draftReturnOrderId",
      ],
    },
    action: {
      type: "string",
      label: "Action",
      description: "Whether to accept or reject the draft return order. `accept` approves the return and triggers shipment label creation. `reject` declines the return.",
      options: [
        "accept",
        "reject",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.returnista.processDraftReturnOrder({
      $,
      accountId: this.accountId,
      draftReturnOrderId: this.draftReturnOrderId,
      action: this.action,
    });
    $.export("$summary", `Successfully ${this.action}ed draft return order ${this.draftReturnOrderId}`);
    return response;
  },
};
