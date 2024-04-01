import paigo from "../../paigo.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "paigo-add-credits",
  name: "Add Credits",
  description: "Increments the credit balance of a specific customer. Requires input of customer id and the amount of credits to be added. It returns the updated balance.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    paigo,
    customerId: {
      propDefinition: [
        paigo,
        "customerId",
      ],
    },
    creditAmount: {
      propDefinition: [
        paigo,
        "creditAmount",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.paigo.incrementCreditBalance(this.customerId, this.creditAmount);
    $.export("$summary", `Successfully added ${this.creditAmount} credits to customer ${this.customerId}`);
    return response;
  },
};
