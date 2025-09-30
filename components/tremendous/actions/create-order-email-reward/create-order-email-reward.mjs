import app from "../../tremendous.app.mjs";
import { DELIVERY_METHOD_OPTIONS } from "../../common/constants.mjs";

export default {
  name: "Create Order Email Reward",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      optional: true,
    },
    products: {
      propDefinition: [
        app,
        "products",
      ],
      optional: true,
    },
    infoBox: {
      type: "alert",
      alertType: "info",
      content: "Either `Products` or `Campaign ID` must be specified. [See the documentation](https://developers.tremendous.com/reference/create-order) for more information.",
    },
    fundingSourceId: {
      propDefinition: [
        app,
        "fundingSourceId",
      ],
      default: "balance",
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "Reference for this order. If set, any subsequent requests with the same `External ID` will not create any further orders, and simply return the initially created order.",
      optional: true,
    },
    valueAmount: {
      type: "string",
      label: "Value Amount",
      description: "Amount of the reward.",
    },
    valueCurrencyCode: {
      type: "string",
      label: "Value Currency Code",
      description: "Currency of the reward.",
    },
    recipientName: {
      type: "string",
      label: "Recipient Name",
      description: "Name of the recipient.",
    },
    recipientEmail: {
      type: "string",
      label: "Recipient Email",
      description: "Email address of the recipient.",
    },
    recipientPhone: {
      type: "string",
      label: "Recipient Phone",
      description: "Phone number of the recipient. For non-US phone numbers, specify the country code (prefixed with `+`).",
    },
    deliveryMethod: {
      type: "string",
      label: "Delivery Method",
      description: "How to deliver the reward to the recipient.",
      options: DELIVERY_METHOD_OPTIONS,
    },
  },
  async run({ $ }) {
    const response = await this.app.createOrder({
      $,
      data: {
        external_id: this.externalId,
        payment: {
          funding_source_id: this.fundingSourceId,
        },
        reward: {
          campaign_id: this.campaignId,
          products: this.products,
          value: {
            denomination: this.valueAmount,
            currency_code: this.valueCurrencyCode,
          },
          recipient: {
            name: this.recipientName,
            email: this.recipientEmail,
            phone: this.recipientPhone,
          },
          delivery: {
            method: this.deliveryMethod,
          },
        },
      },
    });

    $.export("$summary", `Successfully created order (ID: ${response?.order?.id})`);

    return response;
  },
};
