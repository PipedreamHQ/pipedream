import { parseObject } from "../../common/utils.mjs";
import shopware from "../../shopware.app.mjs";

export default {
  key: "shopware-create-order",
  name: "Create Order",
  description: "Create a new order. [See the documentation](https://shopware.stoplight.io/docs/admin-api/52ce9936f6ea4-create-a-new-order-resources)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    shopware,
    billingAddressId: {
      propDefinition: [
        shopware,
        "customerAddressId",
      ],
      label: "Billing Address ID",
      description: "The ID of the billing address to use for the order",
    },
    currencyId: {
      propDefinition: [
        shopware,
        "currencyId",
      ],
    },
    salesChannelId: {
      propDefinition: [
        shopware,
        "salesChannelId",
      ],
    },
    stateId: {
      propDefinition: [
        shopware,
        "stateId",
        () => ({
          type: "order.state",
        }),
      ],
    },
    orderDateTime: {
      type: "string",
      label: "Order Date Time",
      description: "The date and time the order was created",
    },
    priceObject: {
      type: "object",
      label: "Price Object",
      description: "Price object to use for the order. Example: `{ \"netPrice\": 1.00, \"totalPrice\": 1.00, \"positionPrice\": 1.00, \"rawTotal\": 1.00, \"taxStatus\": \"Free\", \"calculatedTaxes\": {}, \"taxRules\": {} }` [See the documentation](https://shopware.stoplight.io/docs/admin-api/52ce9936f6ea4-create-a-new-order-resources) for more information.",
    },
    shippingCostsObject: {
      type: "object",
      label: "Shipping Costs Object",
      description: "Shipping costs object to use for the order. Example: `{ \"unitPrice\": 1.00, \"totalPrice\": 1.00, \"quantity\": 1, \"calculatedTaxes\": {}, \"taxRules\": {} }` [See the documentation](https://shopware.stoplight.io/docs/admin-api/52ce9936f6ea4-create-a-new-order-resources) for more information.",
    },
    currencyObject: {
      type: "object",
      label: "Currency Object",
      description: "Currency object to use for the order. Example: `{ \"factor\": 1.0, \"symbol\": \"€\", \"isoCode\": \"EUR\", \"itemRounding\": { \"decimals\": 2, \"interval\": 1.0, \"roundForNet\": true }, \"totalRounding\": { \"decimals\": 2, \"interval\": 1.0, \"roundForNet\": true } }` [See the documentation](https://shopware.stoplight.io/docs/admin-api/52ce9936f6ea4-create-a-new-order-resources) for more information.",
    },
    currencyFactor: {
      type: "string",
      label: "Currency Factor",
      description: "Rate at which currency is exchanged",
    },
    itemRounding: {
      type: "object",
      label: "Item Rounding",
      description: "The rounding method to use for the order items. Example: {\"extensions\":[],\"decimals\":2,\"interval\":0.01,\"roundForNet\":true}",
    },
    totalRounding: {
      type: "object",
      label: "Total Rounding",
      description: "The rounding method to use for the order total. Example: {\"extensions\":[],\"decimals\":2,\"interval\":0.01,\"roundForNet\":true}",
    },
  },
  async run({ $ }) {
    const { data } = await this.shopware.createOrder({
      $,
      params: {
        _response: "json",
      },
      data: {
        billingAddressId: this.billingAddressId,
        currencyId: this.currencyId,
        salesChannelId: this.salesChannelId,
        stateId: this.stateId,
        orderDateTime: this.orderDateTime,
        price: parseObject(this.priceObject),
        shippingCosts: parseObject(this.shippingCostsObject),
        currencyFactor: this.currencyFactor && parseFloat(this.currencyFactor),
        currency: parseObject(this.currency),
        itemRounding: parseObject(this.itemRounding),
        totalRounding: parseObject(this.totalRounding),
      },
    });

    $.export("$summary", `Successfully created order with ID: ${data.id}`);
    return data;
  },
};
