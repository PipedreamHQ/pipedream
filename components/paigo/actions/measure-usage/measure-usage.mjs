import paigo from "../../paigo.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "paigo-measure-usage",
  name: "Measure Usage",
  description: "Records the amount of a specific usage type linked with a customer.",
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
    dimensionId: {
      propDefinition: [
        paigo,
        "dimensionId",
      ],
    },
    usageAmount: {
      propDefinition: [
        paigo,
        "usageAmount",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.paigo.recordUsage(
      this.customerId,
      this.dimensionId,
      this.usageAmount,
    );
    $.export("$summary", `Recorded usage for customer: ${this.customerId}`);
    return response;
  },
};
