// legacy_hash_id: a_8Ki04R
import { axios } from "@pipedream/platform";

export default {
  key: "xero_accounting_api-get-item",
  name: "Get Item",
  description: "Gets details of an item.",
  version: "0.2.1",
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
    item_id: {
      type: "string",
      description: "You can specify an individual record by appending the value to the endpoint, i.e.\n**GET https://.../Items/{identifier}**. Possible values:\n* **ItemID** - The Xero identifier for an Item e.g. 297c2dc5-cc47-4afd-8ec8-74990b8761e9\n* **Code**- The user defined code of an item e.g. ITEM-001",
    },
  },
  async run({ $ }) {
  //See the API docs: https://developer.xero.com/documentation/api/items#GET

    if (!this.tenant_id || !this.item_id) {
      throw new Error("Must provide tenant_id, item_id parameters.");
    }

    return await axios($, {
      url: `https://api.xero.com/api.xro/2.0/Items/${this.item_id}`,
      headers: {
        "Authorization": `Bearer ${this.xero_accounting_api.$auth.oauth_access_token}`,
        "xero-tenant-id": this.tenant_id,
      },
    });
  },
};
