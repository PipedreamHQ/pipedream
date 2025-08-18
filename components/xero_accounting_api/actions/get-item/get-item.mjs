import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-get-item",
  name: "Get Item",
  description: "Gets details of an item.",
  version: "0.2.2",
  type: "action",
  props: {
    xeroAccountingApi,
    tenantId: {
      propDefinition: [
        xeroAccountingApi,
        "tenantId",
      ],
    },
    itemId: {
      label: "Item ID",
      type: "string",
      description: "Possible values:\n* **ItemID** - The Xero identifier for an Item e.g. 297c2dc5-cc47-4afd-8ec8-74990b8761e9\n* **Code**- The user defined code of an item e.g. ITEM-001",
    },
  },
  async run({ $ }) {
    try {
      const response = await this.xeroAccountingApi.getItemById({
        $,
        tenantId: this.tenantId,
        itemId: this.itemId,
      });

      $.export("$summary", `Item retrieved successfully: ${this.itemId}`);
      return response;
    } catch (e) {
      $.export("$summary", `No item found with identifier: ${this.itemId}`);
      return {};
    }
  },
};
