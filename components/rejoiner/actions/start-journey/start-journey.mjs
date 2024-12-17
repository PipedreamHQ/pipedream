import rejoiner from "../../rejoiner.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "rejoiner-start-journey",
  name: "Start Journey",
  description: "Triggers the beginning of a customer journey in Rejoiner. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    rejoiner: {
      type: "app",
      app: "rejoiner",
    },
    journeyId: {
      propDefinition: [
        rejoiner,
        "journeyId",
      ],
    },
    customerId: {
      propDefinition: [
        rejoiner,
        "customerId",
      ],
    },
    metadata: {
      propDefinition: [
        rejoiner,
        "metadata",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    this.rejoiner.journeyId = this.journeyId;
    this.rejoiner.customerId = this.customerId;
    if (this.metadata) {
      this.rejoiner.metadata = this.metadata;
    }

    const response = await this.rejoiner.triggerCustomerJourney();

    $.export(
      "$summary",
      `Triggered journey ${this.journeyId} for customer ${this.customerId}`,
    );
    return response;
  },
};
