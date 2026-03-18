import billsby from "../../billsby.app.mjs";

export default {
  key: "billsby-create-one-time-charge",
  name: "Create One-Time Charge",
  description: "Create a one-time charge for a subscription. [See the documentation](https://support.billsby.com/reference/create-a-one-time-charge)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    billsby,
    customerId: {
      propDefinition: [
        billsby,
        "customerId",
      ],
    },
    currencyCode: {
      type: "string",
      label: "Currency Code",
      description: "The code for the currency of the one-time charge",
    },
    amount: {
      type: "integer",
      label: "Amount",
      description: "The amount of the one-time charge",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description for the one-time charge",
    },
  },
  async run({ $ }) {
    const response = await this.billsby.createOneTimeCharge({
      $,
      customerId: this.customerId,
      data: {
        currencyCode: this.currencyCode,
        amount: this.amount,
        description: this.description,
      },
    });
    $.export("$summary", "Successfully created one-time charge");
    return response;
  },
};
