// legacy_hash_id: a_rJid1r
import { axios } from "@pipedream/platform";

export default {
  key: "xero_accounting_api-list-manual-journals",
  name: "List Manual Journals",
  description: "Lists information from manual journals in the given tenant id as per filter parameters.",
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
    manual_journal_id: {
      type: "string",
      description: "You can specify an individual record by appending the ManualJournalID to the endpoint, i.e. **GET https://.../ManualJournals/{identifier}**",
      optional: true,
    },
    modified_after: {
      type: "string",
      description: "The ModifiedAfter filter is actually an HTTP header: **'If-Modified-Since'**. A UTC timestamp (yyyy-mm-ddThh:mm:ss) . Only manual journals created or modified since this timestamp will be returned e.g. 2009-11-12T00:00:00",
      optional: true,
    },
    where: {
      type: "string",
      description: "Filter by an any element (*see [Filters](https://developer.xero.com/documentation/api/requests-and-responses#get-modified)*)",
      optional: true,
    },
    order: {
      type: "string",
      description: "Order by any element returned (*see [Order By](https://developer.xero.com/documentation/api/requests-and-responses#ordering)*)",
      optional: true,
    },
    page: {
      type: "string",
      description: "Up to 100 manual journals will be returned per call, with journal lines shown for each, when the page parameter is used e.g. page=1",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the API docs: https://developer.xero.com/documentation/api/manual-journals#GET

    if (!this.tenant_id) {
      throw new Error("Must provide tenant_id parameter.");
    }

    const manualJournalId = this.manual_journal_id || "";

    var headers = {
      "Authorization": `Bearer ${this.xero_accounting_api.$auth.oauth_access_token}`,
      "xero-tenant-id": this.tenant_id,
    };

    if (this.modified_after) {
      headers["If-Modified-Since"] = this.modified_after;
    }

    return await axios($, {
      url: `https://api.xero.com/api.xro/2.0/ManualJournals/${manualJournalId}`,
      headers,
      params: {
        Where: this.where,
        order: this.order,
        page: this.page,
      },
    });
  },
};
