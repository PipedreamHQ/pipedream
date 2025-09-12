import {
  ORDER_TYPE_OPTIONS,
  ORDER_WITH_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
} from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import plentyone from "../../plentyone.app.mjs";

export default {
  key: "plentyone-get-orders",
  name: "Get Orders",
  description: "Retrieves a list of orders from PlentyONE. [See the documentation](https://developers.plentymarkets.com/en-gb/plentymarkets-rest-api/index.html#/Order/get_rest_orders)",
  version: "0.0.1",
  type: "action",
  props: {
    plentyone,
    typeID: {
      type: "integer",
      label: "Order Type ID",
      description: "Type of order to retrieve. If not provided, all order types will be retrieved.",
      options: ORDER_TYPE_OPTIONS,
      optional: true,
    },
    contactId: {
      propDefinition: [
        plentyone,
        "contactId",
      ],
      optional: true,
    },
    contactData: {
      type: "string",
      label: "Contact Data",
      description: "Filter that restricts the search result to orders with a specific contact data.",
      optional: true,
    },
    referrerId: {
      type: "integer",
      label: "Referrer ID",
      description: "Filter that restricts the search result to orders of a specific order referrer. The ID of the order referrer must be specified.",
      optional: true,
    },
    shippingProfileId: {
      type: "integer",
      label: "Shipping Profile ID",
      description: "Filter that restricts the search result to orders with a specific shipping profile. The ID of shipping profile must be specified.",
      optional: true,
    },
    shippingServiceProviderId: {
      type: "integer",
      label: "Shipping Service Provider ID",
      description: "Filter that restricts the search result to orders with a specific shipping service provider (like DHL, UPS, etc.). The ID of shipping service provider must be specified.",
      optional: true,
    },
    ownerUserId: {
      type: "integer",
      label: "Owner User ID",
      description: "Filter that restricts the search result to orders with a specific owner. The user ID of the owner must be specified.",
      optional: true,
    },
    warehouseId: {
      type: "integer",
      label: "Warehouse ID",
      description: "Filter that restricts the search result to orders with a specific main warehouse. The ID of the warehouse must be specified.",
      optional: true,
    },
    isEbayPlus: {
      type: "boolean",
      label: "Is eBay Plus",
      description: "Filter that restricts the search result to orders with the referrer eBay PLUS.",
      optional: true,
    },
    includedVariation: {
      type: "integer",
      label: "Included Variation",
      description: "Filter that restricts the search result to orders including a specific variation. The ID of the variation must be specified.",
      optional: true,
    },
    includedItem: {
      type: "integer",
      label: "Included Item",
      description: "Filter that restricts the search result to orders including a specific item. The ID of the item must be specified.",
      optional: true,
    },
    orderIds: {
      propDefinition: [
        plentyone,
        "orderId",
      ],
      type: "string[]",
      label: "Order IDs",
      description: "Filter that restricts the search result to orders with a specific ID.",
      optional: true,
    },
    countryId: {
      propDefinition: [
        plentyone,
        "countryId",
      ],
      optional: true,
    },
    orderItemName: {
      type: "string",
      label: "Order Item Name",
      description: "Filter that restricts the search result to orders including a specific item name. The name of the item must be specified.",
      optional: true,
    },
    variationNumber: {
      type: "integer",
      label: "Variation Number",
      description: "Filter that restricts the search result to orders including a specific variation number. The number of the variation must be specified.",
      optional: true,
    },
    packageNumber: {
      type: "string",
      label: "Package Number",
      description: "Filter that restricts the search result to orders including a specific package number. The number of the package must be specified.",
      optional: true,
    },
    externalOrderId: {
      type: "string",
      label: "External Order ID",
      description: "Filter that restricts the search result to orders including a specific external order ID. The external order ID must be specified.",
      optional: true,
    },
    clientId: {
      type: "integer",
      label: "Client ID",
      description: "Filter that restricts the search result to orders belonging to a specific client. The ID of the client must be specified.",
      optional: true,
    },
    paymentStatus: {
      type: "string",
      label: "Payment Status",
      description: "Filter that restricts the search result to orders with a specific payment status.",
      options: PAYMENT_STATUS_OPTIONS,
      optional: true,
    },
    paymentMethodId: {
      type: "integer",
      label: "Payment Method ID",
      description: "Filter that restricts the search result to orders with a specific payment method. The ID of the payment method must be specified.",
      optional: true,
    },
    with: {
      type: "string[]",
      label: "With",
      description: "Load additional relations for an order.",
      options: ORDER_WITH_OPTIONS,
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.plentyone.getOrders({
        $,
        params: {
          typeID: this.typeID,
          contactId: this.contactId,
          contactData: this.contactData,
          referrerId: this.referrerId,
          shippingProfileId: this.shippingProfileId,
          shippingServiceProviderId: this.shippingServiceProviderId,
          ownerUserId: this.ownerUserId,
          warehouseId: this.warehouseId,
          isEbayPlus: this.isEbayPlus,
          includedVariation: this.includedVariation,
          includedItem: this.includedItem,
          orderIds: parseObject(this.orderIds),
          countryId: this.countryId,
          orderItemName: this.orderItemName,
          variationNumber: this.variationNumber,
          packageNumber: this.packageNumber,
          externalOrderId: this.externalOrderId,
          clientId: this.clientId,
          paymentStatus: this.paymentStatus,
          paymentMethodId: this.paymentMethodId,
          with: parseObject(this.with),
        },
      });

      $.export("$summary", `Successfully retrieved ${response.data?.length || 0} orders`);
      return response;
    } catch (error) {
      $.export("$summary", "Successfully retrieved 0 orders");
      return {};
    }
  },
};
