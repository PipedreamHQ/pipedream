import starshipit from "../../starshipit.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "starshipit-get-tracking",
  name: "Get Tracking Details",
  description: "Retrieve tracking details using a tracking number or order number. [See the documentation](https://api-docs.starshipit.com/#a655a3b4-ea39-42c4-acb4-d868ad40dc47)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    starshipit,
    trackingNumber: {
      propDefinition: [
        starshipit,
        "trackingNumber",
      ],
    },
    orderNumber: {
      propDefinition: [
        starshipit,
        "orderNumber",
        () => ({
          shipped: true,
        }),
      ],
      description: "The order number of a shipped order to get tracking details for",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.trackingNumber && !this.orderNumber) {
      throw new ConfigurationError("Either tracking number or order number must be provided.");
    }
    const { results } = await this.starshipit.getTrackingDetails({
      params: {
        tracking_number: this.trackingNumber,
        order_number: this.orderNumber,
      },
      $,
    });
    if (results?.order_number) {
      $.export("$summary", `Successfully retrieved tracking details for order ${results.order_number}.`);
    }
    return results;
  },
};
