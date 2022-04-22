import { axios, ConfigurationError } from "@pipedream/platform";
import {
  formatArrayObjects,
  removeNullEntries,
} from "../../common/common.util.mjs";
import constant from "../../common/common.constants.mjs";

export default {
  key: "xero_accounting_api-add-line-item-to-invoice",
  name: "Add Items to Existing Sales Invoice",
  version: "0.0.2",
  type: "action",
  props: {
    xero_accounting_api: {
      type: "app",
      app: "xero_accounting_api",
    },
    tenant_id: {
      type: "string",
      description:
        "Id of the organization tenant to use on the Xero Accounting API. See [Get Tenant Connections](https://pipedream.com/@sergio/xero-accounting-api-get-tenant-connections-p_OKCzOgn/edit) for a workflow example on how to pull this data.",
    },
    InvoiceID: {
      type: "string",
      description: "ID of Invoice to be updated",
    },
    LineItems: {
      type: "string[]",
      description: `Provide multiple items using the example below. At least one is required to create a complete Invoice. 
        Example:
        \`{
            "Description":"Football",
            "Quantity":"20",
            "UnitAmount":"50000",
            "TaxType":"Refer to https://developer.xero.com/documentation/api/accounting/types#report-tax-types",
        }\``,
    },
  },
  async run({ $ }) {
    const { tenant_id, InvoiceID, LineItems } = this;
    const data = removeNullEntries({
      InvoiceID,
      LineItems: formatArrayObjects(LineItems, constant.ALLOWED_LINEITEMS_KEYS),
    });
    console.log("payload", data);
    try {
      const response = await axios($, {
        method: "post",
        url: "https://api.xero.com/api.xro/2.0/invoices",
        headers: {
          Authorization: `Bearer ${this.xero_accounting_api.$auth.oauth_access_token}`,
          "xero-tenant-id": tenant_id,
        },
        data,
      });
      response && $.export("$summary", "Line item added successfully");
      return response;
    } catch (error) {
      throw new ConfigurationError(`An error occured creating line item`);
    }
  },
};
