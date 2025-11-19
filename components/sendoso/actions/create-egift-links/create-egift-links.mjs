import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-create-egift-links",
  name: "Create eGift Links",
  description: "Generate eGift links. [See the documentation](https://developer.sendoso.com/rest-api/sends/create-egift-links)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sendoso,
    touchId: {
      propDefinition: [
        sendoso,
        "touchId",
      ],
    },
    amount: {
      type: "integer",
      label: "Amount",
      description: "The number of links to generate.",
      min: 1,
    },
  },
  async run({ $ }) {
    const response = await this.sendoso.createEgiftLinks({
      $,
      touch_id: this.touchId,
      amount: this.amount,
    });
    $.export("$summary", `Successfully created ${this.amount} eGift links`);
    return response;
  },
};
