// legacy_hash_id: a_a4ivba
import { axios } from "@pipedream/platform";

export default {
  key: "xero_accounting_api-list-credit-notes",
  name: "List Credit Notes",
  description: "Lists information from credit notes in the given tenant id as per filter parameters.",
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
    credit_note_identifier: {
      type: "string",
      description: "Credit note identifier of the contact to get. Possible values: \n* **CreditNoteID** - The Xero identifier for a contact note e.g. 297c2dc5-cc47-4afd-8ec8-74990b8761e9\n* **CreditNoteNumber** -  Identifier for Credit Note CN-8743802",
      optional: true,
    },
    modified_after: {
      type: "string",
      description: "The ModifiedAfter filter is actually an HTTP header: **'If-Modified-Since'.**\nA UTC timestamp (yyyy-mm-ddThh:mm:ss). Only credit notes or modified since this timestamp will be returned e.g. 2009-11-12T00:00:00",
      optional: true,
    },
    where: {
      type: "string",
      description: "Filter by an any element ( see [Filters](https://developer.xero.com/documentation/api/requests-and-responses#get-modified) )",
      optional: true,
    },
    order: {
      type: "string",
      description: "Order by any element returned ( see [Order By](https://developer.xero.com/documentation/api/requests-and-responses#ordering) )",
      optional: true,
    },
    page: {
      type: "string",
      description: "Up to 100 credit notes will be returned per call, with line items shown for each, when the page parameter is used e.g. page=1",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the API docs: https://developer.xero.com/documentation/api/credit-notes#GET

    if (!this.tenant_id) {
      throw new Error("Must provide tenant_id parameter.");
    }

    const creditNoteIdentifier = this.credit_note_identifier || "";

    var headers = {
      "Authorization": `Bearer ${this.xero_accounting_api.$auth.oauth_access_token}`,
      "xero-tenant-id": this.tenant_id,
    };

    if (this.modified_after) {
      headers["If-Modified-Since"] = this.modified_after;
    }

    return await axios($, {
      url: `https://api.xero.com/api.xro/2.0/CreditNotes/${creditNoteIdentifier}`,
      headers,
      params: {
        Where: this.where,
        order: this.order,
        page: this.page,
      },
    });
  },
};
