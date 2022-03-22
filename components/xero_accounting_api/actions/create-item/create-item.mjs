// legacy_hash_id: a_a4ivOG
import { axios } from "@pipedream/platform";

export default {
  key: "xero_accounting_api-create-item",
  name: "Create Item",
  description: "Creates a new item.",
  version: "0.1.1",
  type: "action",
  props: {
    xero_accounting_api: {
      type: "app",
      app: "xero_accounting_api",
    },
    tenant_id: {
      type: "string",
      description: "Id of the organization tenant to use on the Xero Accounting API. See [Get Tenant Connections](https://pipedream.com/@sergio/xero-accounting-api-get-tenant-connections-p_OKCzOgn/edit) for a workflow example on how to pull this data.",
    },
    code: {
      type: "string",
      description: "User defined item code (max length = 30)",
    },
    inventory_asset_account_code: {
      type: "string",
      description: "The inventory asset [account](https://developer.xero.com/documentation/api/accounts/) for the item. The account must be of type INVENTORY. The COGSAccountCode in PurchaseDetails is also required to create a tracked item",
      optional: true,
    },
    name: {
      type: "string",
      description: "The name of the item (max length = 50)",
      optional: true,
    },
    is_sold: {
      type: "boolean",
      description: "Boolean value, defaults to true. When IsSold is true the item will be available on sales transactions in the Xero UI. If IsSold is updated to false then Description and SalesDetails values will be nulled.",
      optional: true,
    },
    is_purchased: {
      type: "boolean",
      description: "Boolean value, defaults to true. When IsPurchased is true the item is available for purchase transactions in the Xero UI. If IsPurchased is updated to false then PurchaseDescription and PurchaseDetails values will be nulled.",
      optional: true,
    },
    description: {
      type: "string",
      description: "The sales description of the item (max length = 4000)",
      optional: true,
    },
    purchase_description: {
      type: "string",
      description: "The purchase description of the item (max length = 4000)",
      optional: true,
    },
    purchase_details: {
      type: "string",
      description: "See Purchases & Sales. The [PurchaseDetails](https://developer.xero.com/documentation/api/items#PurchasesSales) element can contain a number of individual sub-elements.",
      optional: true,
    },
    sales_details: {
      type: "string",
      description: "See Purchases & Sales. The [SalesDetails](https://developer.xero.com/documentation/api/items#PurchasesSales) element can contain a number of individual sub-elements.",
      optional: true,
    },
    unitdp: {
      type: "string",
      description: "By default UnitPrice is returned to two decimal places.",
      optional: true,
      options: [
        "2",
        "4",
      ],
    },
  },
  async run({ $ }) {
  //See the API docs: https://developer.xero.com/documentation/api/items#POST

    if (!this.tenant_id || !this.code) {
      throw new Error("Must provide tenant_id, and code parameters.");
    }

    return await axios($, {
      method: "put",
      url: "https://api.xero.com/api.xro/2.0/Items",
      headers: {
        "Authorization": `Bearer ${this.xero_accounting_api.$auth.oauth_access_token}`,
        "Accept": "application/json",
        "xero-tenant-id": this.tenant_id,
      },
      data: {
        Code: this.code,
        InventoryAssetAccountCode: this.inventory_asset_account_code,
        Name: this.name,
        IsSold: this.is_sold,
        IsPurchased: this.is_purchased,
        Description: this.description,
        PurchaseDescription: this.purchase_description,
        PurchaseDetails: this.purchase_details,
        SalesDetails: this.sales_details,
      },
      params: {
        unitdp: this.unitdp,
      },
    });
  },
};
