import app from "../../crowdpower.app.mjs";

export default {
  key: "crowdpower-create-customer-charge",
  name: "Create Customer Charge",
  description: "Create a charge for a user. [See the documentation](https://documenter.getpostman.com/view/17896162/UV5TFKbh#d89820d6-5d65-4ff7-87ba-6cddb359d8f3)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
    },
    amount: {
      propDefinition: [
        app,
        "amount",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createCustomerCharge({
      $,
      data: {
        user_id: this.userId,
        amount: this.amount,
      },
    });

    $.export("$summary", response.success
      ? `Request succeeded with code ${response.code}`
      : `Request failed with code ${response.code}`);
      
    return response;
  },
};
