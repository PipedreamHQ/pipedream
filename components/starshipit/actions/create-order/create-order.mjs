import starshipit from "../../starshipit.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "starshipit-create-order",
  name: "Create Order",
  description: "Create an outbound order in Starshipit. [See the documentation](https://api-docs.starshipit.com/#b90251d2-1d1c-47b1-ac07-eeeb21cade7b)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    starshipit,
    orderNumber: {
      type: "string",
      label: "Order Number",
      description: "The identifier of the order pulled from source e-Commerce platform (max length: 50)",
    },
    destination: {
      propDefinition: [
        starshipit,
        "contactId",
      ],
    },
    numItems: {
      type: "integer",
      label: "Number of Items",
      description: "Number of items in the order",
      reloadProps: true,
    },
  },
  additionalProps() {
    const props = {};
    for (let i = 1; i <= this.numItems; i++) {
      props[`item_${i}_description`] = {
        type: "string",
        label: `Item ${i} Description`,
        description: "Product name or description",
        optional: true,
      };
      props[`item_${i}_quantity`] = {
        type: "string",
        label: `Item ${i} Quantity`,
        description: "The number of product ordered",
        optional: true,
      };
      props[`item_${i}_weight`] = {
        type: "string",
        label: `Item ${i} Weight`,
        description: "Unit weight of the product in kilograms (kg)",
        optional: true,
      };
      props[`item_${i}_value`] = {
        type: "string",
        label: `Item ${i} Value`,
        description: "Unit price of the product",
        optional: true,
      };
    }
    return props;
  },
  methods: {
    async getOrderContact(destinationId) {
      const contacts = await this.starshipit.paginate({
        resourceFn: this.starshipit.listContacts,
        resourceName: "addresses",
      });
      return contacts.find(({ id }) => id === destinationId);
    },
    parseFloat(i, type) {
      return utils.parseFloatProp(this, "item", i, type);
    },
  },
  async run({ $ }) {
    const items = [];
    for (let i = 1; i <= this.numItems; i++) {
      items.push({
        description: this[`item_${i}_description`],
        quantity: this.parseFloat(i, "quantity"),
        weight: this.parseFloat(i, "weight"),
        value: this.parseFloat(i, "value"),
      });
    }
    const destination = await this.getOrderContact(this.destination);

    const response = await this.starshipit.createOrder({
      data: {
        order: {
          order_number: this.orderNumber,
          destination,
          items,
        },
      },
      $,
    });
    if (response?.success === false) {
      throw new Error(`${response.errors[0].message}: ${response.errors[0].details}`);
    }
    if (response?.order?.order_id) {
      $.export("$summary", `Successfully created order with ID: ${response.order.order_id}`);
    }
    return response;
  },
};
