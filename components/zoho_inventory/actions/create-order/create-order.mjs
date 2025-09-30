import zohoInventory from "../../zoho_inventory.app.mjs";

export default {
  key: "zoho_inventory-create-order",
  name: "Create Sales Order",
  description: "Create a new sales order in Zoho Inventory. [See the docs here](https://www.zoho.com/inventory/api/v1/salesorders/#create-a-sales-order)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    zohoInventory,
    organization: {
      propDefinition: [
        zohoInventory,
        "organization",
      ],
    },
    customer: {
      propDefinition: [
        zohoInventory,
        "customer",
      ],
    },
    items: {
      propDefinition: [
        zohoInventory,
        "items",
      ],
      withLabel: true,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    for (const item of this.items) {
      props[item.label] = {
        type: "string",
        label: `Quantity of ${item.label}`,
        description: `Enter the line item quantity for item ${item.label}`,
      };
    }
    return props;
  },
  async run({ $ }) {
    const params = {
      organization_id: this.organization,
    };
    const data = {
      customer_id: this.customer,
      line_items: [],
    };
    for (const item of this.items) {
      data.line_items.push({
        item_id: item.value,
        quantity: this[item.label],
      });
    }
    const response = await this.zohoInventory.createSalesOrder({
      params,
      data,
      $,
    });
    $.export("$summary", "Successfully created sales order");
    return response;
  },
};
