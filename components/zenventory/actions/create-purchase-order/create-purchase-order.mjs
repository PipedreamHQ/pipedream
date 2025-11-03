import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import zenventory from "../../zenventory.app.mjs";

export default {
  key: "zenventory-create-purchase-order",
  name: "Create Purchase Order",
  description: "Generates a new purchase order. [See the documentation](https://docs.zenventory.com/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    zenventory,
    supplierId: {
      type: "integer",
      label: "Supplier Id",
      description: "Id of the supplier that is being ordered from.",
      optional: true,
    },
    supplierName: {
      type: "string",
      label: "Supplier Name",
      description: "Name of the supplier that is being ordered from. Ignored if supplierId is provided.",
      optional: true,
    },
    warehouseId: {
      type: "integer",
      label: "Warehouse Id",
      description: "Id of the warehouse the items will be delivered to. If no warehouse parameters are given, then the user's current warehouse will be used.",
      optional: true,
    },
    warehouseName: {
      type: "string",
      label: "Warehouse Name",
      description: "Name of the warehouse the items will be delivered to. Ignored if warehouseId is provided.",
      optional: true,
    },
    clientId: {
      type: "integer",
      label: "Client Id",
      description: "Id of the client that the purchase order is for. Defaults to the user's client id.",
      optional: true,
    },
    clientName: {
      type: "string",
      label: "Client Name",
      description: "Name of the client that the purchase order is for. Ignored if clientId is provided and is nonzero.",
      optional: true,
    },
    orderNumber: {
      type: "string",
      label: "Order Number",
      description: "Order number for the purchase order. If blank, one will automatically be generated.",
      optional: true,
    },
    draft: {
      type: "boolean",
      label: "Draft",
      description: "True if the purchase order should be created as a draft to allow future editing.",
      optional: true,
    },
    requiredByDate: {
      type: "string",
      label: "Required By.",
      description: "The date of the purchase. **Format: YYYY-MM-DD**",
      optional: true,
    },
    projectNumber: {
      type: "string",
      label: "Project Number",
      description: "The number of the project.",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "A note of the purchase.",
      optional: true,
    },
    items: {
      type: "string[]",
      label: "Items",
      description: "A list of object of ordered items. **Example: {\"itemId\": 123, \"sku\": \"SKU123\", \"description\": \"description\", \"quantity\": 1}**. [See the documentation](https://docs.zenventory.com/#tag/purchase_order/paths/~1purchase-orders/post) for further information.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.supplierId && !this.supplierName) {
      throw new ConfigurationError("You must provide at least 'Supplier Id' or 'Supplier Name'.");
    }

    const response = await this.zenventory.createPurchaseOrder({
      $,
      data: {
        supplierId: this.supplierId,
        supplierName: this.supplierName,
        warehouseId: this.warehouseId,
        warehouseName: this.warehouseName,
        clientId: this.clientId,
        clientName: this.clientName,
        orderNumber: this.orderNumber,
        draft: this.draft,
        requiredByDate: this.requiredByDate,
        projectNumber: this.projectNumber,
        notes: this.notes,
        items: parseObject(this.items),
      },
    });

    $.export("$summary", `Successfully created purchase order with ID ${response.id}`);
    return response;
  },
};
