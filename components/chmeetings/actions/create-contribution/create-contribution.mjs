import app from "../../chmeetings.app.mjs";

export default {
  key: "chmeetings-create-contribution",
  name: "Create Contribution",
  description: "Create a new contribution in ChMeetings. [See the documentation](https://api.chmeetings.com/scalar/?_gl=1*xb9g3y*_gcl_au*MTI4MjM0MTM4Mi4xNzUzNzIxOTQw#tag/contributions/post/apiv1contributions)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    date: {
      propDefinition: [
        app,
        "date",
      ],
    },
    paymentMethod: {
      propDefinition: [
        app,
        "paymentMethod",
      ],
    },
    fundName: {
      propDefinition: [
        app,
        "fundName",
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
    const response = await this.app.createContribution({
      $,
      data: {
        date: this.date,
        payment_method: this.paymentMethod,
        funds: [
          {
            fund_name: this.fundName,
            amount: this.amount,
          },
        ],
      },
    });
    $.export("$summary", "Successfully created new contribution with ID: " + response.id);
    return response;
  },
};
