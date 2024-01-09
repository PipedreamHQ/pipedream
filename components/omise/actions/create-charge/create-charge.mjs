import opnPlatformApp from "../../opn_platform.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "omise-create-charge",
  name: "Create a New Charge",
  description: "Create a new charge for a specific customer and amount through the OPN platform.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    opnPlatformApp,
    customerId: {
      propDefinition: [
        opnPlatformApp,
        "customerId",
      ],
    },
    amount: {
      propDefinition: [
        opnPlatformApp,
        "amount",
      ],
    },
    currency: {
      propDefinition: [
        opnPlatformApp,
        "currency",
      ],
    },
    description: {
      propDefinition: [
        opnPlatformApp,
        "description",
      ],
    },
    email: {
      propDefinition: [
        opnPlatformApp,
        "email",
      ],
    },
    metadata: {
      propDefinition: [
        opnPlatformApp,
        "metadata",
      ],
    },
    cardToken: {
      propDefinition: [
        opnPlatformApp,
        "cardToken",
      ],
    },
    defaultCard: {
      propDefinition: [
        opnPlatformApp,
        "defaultCard",
      ],
      optional: true,
    },
    capture: {
      propDefinition: [
        opnPlatformApp,
        "capture",
      ],
    },
    returnUri: {
      propDefinition: [
        opnPlatformApp,
        "returnUri",
      ],
    },
    sourceId: {
      propDefinition: [
        opnPlatformApp,
        "sourceId",
      ],
    },
    status: {
      propDefinition: [
        opnPlatformApp,
        "status",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.opnPlatformApp.createCharge({
      amount: this.amount,
      currency: this.currency,
      customerId: this.customerId,
      cardToken: this.cardToken,
      description: this.description,
      metadata: this.metadata,
      capture: this.capture,
      returnUri: this.returnUri,
      sourceId: this.sourceId,
    });

    $.export("$summary", `Successfully created a new charge with ID: ${response.id}`);
    return response;
  },
};
