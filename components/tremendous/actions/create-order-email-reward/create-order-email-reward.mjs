import app from "../../trackingtime.app.mjs";
import { FUNDING_SOURCE_OPTIONS } from "../../common/constants.mjs";

export default {
  name: "Create Order Email Reward",
  version: "0.0.1",
  key: "tremendous-create-order-email-reward",
  description: "Create an order to send out a reward. [See the documentation](https://developers.tremendous.com/reference/create-order)",
  type: "action",
  props: {
    app,
    campaignId: {
      propDefinition: [
        app,
        "campaignId",
      ],
    },
    products: {
      propDefinition: [
        app,
        "products",
      ],
    },
    infoBox: {
      type: "alert",
      alertType: "info",
      content: "Either `Products` or `Campaign ID` must be specified. [See the documentation](https://developers.tremendous.com/reference/create-order) for more information.",
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "Reference for this order. If set, any subsequent requests with the same `External ID` will not create any further orders, and simply return the initially created order.",
      optional: true,
    },
    fundingSourceId: {
      type: "string",
      label: "Funding Source",
      description: "Tremendous ID of the funding source that will be used to pay for the order.",
      options: FUNDING_SOURCE_OPTIONS,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createOrder({
      $,
      data: {
        external_id: this.externalId,
        payment: this.fundingSourceId && {
          funding_source_id: this.fundingSourceId,
        },
        reward: {
          campaign_id: this.campaignId,
          products: this.products,
        },
      },
    });

    $.export("$summary", `Successfully created order (ID: ${response?.order?.id})`);

    return response;
  },
};
