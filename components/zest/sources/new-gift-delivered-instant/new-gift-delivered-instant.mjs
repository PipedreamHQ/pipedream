import zest from "../../zest.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "zest-new-gift-delivered-instant",
  name: "New Gift Delivered (Instant)",
  description: "Emit new event when a gift is physically delivered. [See the documentation](https://gifts.zest.co/admin/integrations/documentation)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    zest: {
      type: "app",
      app: "zest",
    },
    recipientAddress: {
      propDefinition: [
        zest,
        "recipientAddress",
      ],
    },
    deliveryStatus: {
      propDefinition: [
        zest,
        "deliveryStatus",
      ],
    },
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // Fetching and emitting historical events is not required in this scenario
    },
    async activate() {
      // Code to create a webhook subscription on activate
      // This would depend on the specific API endpoint and data requirements
    },
    async deactivate() {
      // Code to delete a webhook subscription on deactivate
      // This would depend on the specific API endpoint and data requirements
    },
  },
  async run(event) {
    const { body } = event;

    // Assuming the webhook includes recipient address and delivery status
    const recipientAddress = body.recipientAddress;
    const deliveryStatus = body.deliveryStatus;

    // Validate that the required information is present
    if (!recipientAddress || !deliveryStatus) {
      throw new Error("Missing required information: recipient address or delivery status");
    }

    // Emit the event
    this.$emit(body, {
      id: `${recipientAddress}-${deliveryStatus}`,
      summary: `Gift delivered to ${recipientAddress} with status: ${deliveryStatus}`,
      ts: Date.now(),
    });
  },
};
