import { ConfigurationError } from "@pipedream/platform";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-create-item",
  name: "Create Item",
  description: "Creates a new item.",
  version: "0.1.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    xeroAccountingApi,
    tenantId: {
      propDefinition: [
        xeroAccountingApi,
        "tenantId",
      ],
    },
    code: {
      type: "string",
      label: "Code",
      description: "User defined item code (max length = 30)",
    },
    inventoryAssetAccountCode: {
      type: "string",
      label: "Inventory Asset Account Code",
      description: "The inventory asset [account](https://developer.xero.com/documentation/api/accounts/) for the item. The account must be of type INVENTORY. The COGSAccountCode in PurchaseDetails is also required to create a tracked item",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the item (max length = 50)",
      optional: true,
    },
    isSold: {
      type: "boolean",
      label: "Is Sold",
      description: "Boolean value, defaults to true. When IsSold is true the item will be available on sales transactions in the Xero UI. If IsSold is updated to false then Description and SalesDetails values will be nulled.",
      optional: true,
    },
    isPurchased: {
      type: "boolean",
      label: "Is Purchased",
      description: "Boolean value, defaults to true. When IsPurchased is true the item is available for purchase transactions in the Xero UI. If IsPurchased is updated to false then PurchaseDescription and PurchaseDetails values will be nulled.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The sales description of the item (max length = 4000)",
      optional: true,
    },
    purchaseDescription: {
      type: "string",
      label: "Purchase Description",
      description: "The purchase description of the item (max length = 4000)",
      optional: true,
    },
    purchaseDetails: {
      type: "string",
      label: "Purchase Details",
      description: "See Purchases & Sales. The [PurchaseDetails](https://developer.xero.com/documentation/api/items#PurchasesSales) element can contain a number of individual sub-elements.",
      optional: true,
    },
    salesDetails: {
      type: "string",
      label: "Sales Details",
      description: "See Purchases & Sales. The [SalesDetails](https://developer.xero.com/documentation/api/items#PurchasesSales) element can contain a number of individual sub-elements.",
      optional: true,
    },
    unitdp: {
      type: "string",
      label: "Unitdp",
      description: "By default UnitPrice is returned to two decimal places.",
      optional: true,
      options: [
        "2",
        "4",
      ],
    },
  },
  async run({ $ }) {
    if (!this.tenantId || !this.code) {
      throw new ConfigurationError("Must provide **Tenant ID**, and **Code** parameters.");
    }

    const response = await this.xeroAccountingApi.createItem({
      $,
      tenantId: this.tenantId,
      data: {
        Code: this.code,
        InventoryAssetAccountCode: this.inventoryAssetAccountCode,
        Name: this.name,
        IsSold: this.isSold,
        IsPurchased: this.isPurchased,
        Description: this.description,
        PurchaseDescription: this.purchaseDescription,
        PurchaseDetails: this.purchaseDetails,
        SalesDetails: this.salesDetails,
      },
      params: {
        unitdp: this.unitdp,
      },
    });

    $.export("$summary", `Successfully created item with code: ${this.code}`);
    return response;
  },
};
