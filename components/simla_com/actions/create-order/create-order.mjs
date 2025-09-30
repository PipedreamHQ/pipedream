import app from "../../simla_com.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "simla_com-create-order",
  name: "Create Order",
  description: "Creates a new order with customer and order details. [See the documentation](https://docs.simla.com/Developers/API/APIVersions/APIv5#post--api-v5-orders-create).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    site: {
      propDefinition: [
        app,
        "site",
      ],
    },
    customerType: {
      propDefinition: [
        app,
        "customerType",
      ],
    },
    customerId: {
      propDefinition: [
        app,
        "customerId",
        ({ customerType }) => ({
          customerType,
        }),
      ],
    },
    countryIso: {
      propDefinition: [
        app,
        "countryIso",
      ],
    },
    orderType: {
      propDefinition: [
        app,
        "orderType",
      ],
    },
    deliveryCost: {
      type: "string",
      label: "Delivery Cost",
      description: "The cost of delivery.",
    },
    deliveryNetCost: {
      type: "string",
      label: "Delivery Net Cost",
      description: "The net cost of delivery.",
    },
    numberOfItems: {
      type: "integer",
      label: "Number Of Items",
      description: "The number of items to be ordered.",
      default: 1,
      reloadProps: true,
    },
  },
  methods: {
    itemsPropsMapper(prefix) {
      const {
        [`${prefix}initialPrice`]: initialPrice,
        [`${prefix}quantity`]: quantity,
        [`${prefix}comment`]: comment,
        [`${prefix}purchasePrice`]: purchasePrice,
        [`${prefix}productName`]: productName,
        [`${prefix}discountManualAmount`]: discountManualAmount,
        [`${prefix}discountManualPercent`]: discountManualPercent,
      } = this;

      return {
        initialPrice,
        quantity,
        comment,
        purchasePrice,
        productName,
        discountManualAmount,
        discountManualPercent,
      };
    },
    getItemsPropDefinitions({
      prefix,
      label,
    } = {}) {
      return {
        [`${prefix}initialPrice`]: {
          type: "string",
          label: `${label} - Initial Price`,
          description: "The initial price of the item.",
          optional: true,
        },
        [`${prefix}quantity`]: {
          type: "string",
          label: `${label} - Quantity`,
          description: "The quantity of the item.",
          optional: true,
        },
        [`${prefix}comment`]: {
          type: "string",
          label: `${label} - Comment`,
          description: "The comment for the item.",
          optional: true,
        },
        [`${prefix}purchasePrice`]: {
          type: "string",
          label: `${label} - Purchase Price`,
          description: "The purchase price of the item.",
          optional: true,
        },
        [`${prefix}productName`]: {
          type: "string",
          label: `${label} - Product Name`,
          description: "The name of the product.",
          optional: true,
        },
        [`${prefix}discountManualAmount`]: {
          type: "string",
          label: `${label} - Discount Manual Amount`,
          description: "The manual discount amount for the item.",
          optional: true,
        },
        [`${prefix}discountManualPercent`]: {
          type: "string",
          label: `${label} - Discount Manual Percent`,
          description: "The manual discount percent for the item.",
          optional: true,
        },
      };
    },
    createOrder(args = {}) {
      return this.app.post({
        path: "/orders/create",
        ...args,
      });
    },
  },
  async additionalProps() {
    const {
      numberOfItems,
      getItemsPropDefinitions,
    } = this;

    return utils.getAdditionalProps({
      numberOfFields: numberOfItems,
      fieldName: "item",
      getPropDefinitions: getItemsPropDefinitions,
    });
  },
  async run({ $ }) {
    const {
      numberOfItems,
      itemsPropsMapper,
      createOrder,
      countryIso,
      orderType,
      site,
      customerType,
      customerId,
      deliveryCost,
      deliveryNetCost,
    } = this;

    const response = await createOrder({
      $,
      data: {
        site,
        customer: JSON.stringify({
          customerType,
          customerId,
        }),
        order: JSON.stringify({
          countryIso,
          orderType,
          customerType,
          customerId,
          delivery: {
            cost: deliveryCost,
            netCost: deliveryNetCost,
          },
          items: utils.getFieldsProps({
            numberOfFields: numberOfItems,
            fieldName: "item",
            propsMapper: itemsPropsMapper,
          }),
        }),
      },
    });
    $.export("$summary", `Successfully created order with ID \`${response.id}\`.`);
    return response;
  },
};
