// legacy_hash_id: a_8Ki0B8
import { axios } from "@pipedream/platform";

export default {
  key: "app_placeholder-zoho-crm-make-an-api-call",
  name: "Make API Call",
  description: "Makes an aribitrary call to Zoho CRM API.",
  version: "0.1.1",
  type: "action",
  props: {
    request_method: {
      type: "string",
      description: "Http method to use in the request.",
      options: [
        "get",
        "post",
        "put",
        "patch",
        "delete",
      ],
    },
    relative_url: {
      type: "string",
      description: "A path relative to Xero Accounting API to send the request against.",
    },
    headers: {
      type: "object",
      description: "Headers to send in the request. Must include header `xero-tenant-id` with Id of the organization tenant to use on the Xero Accounting API. See [Get Tenant Connections](https://pipedream.com/@sergio/xero-accounting-api-get-tenant-connections-p_OKCzOgn/edit) for a workflow example on how to pull this data.",
    },
    request_body: {
      type: "object",
      description: "Body of the request.",
      optional: true,
    },
  },
  async run({ $ }) {
  // See Quickbooks Rest Accounting API docs at: https://www.zoho.com/crm/developer/docs/api/v2/modules-api.html

    if (!this.request_method || !this.relative_url) {
      throw new Error("Must provide request_method, and relative_url parameters.");
    }

    return await axios($, {
      method: this.request_method,
      url: `https://www.zohoapis.com/${this.relative_url}`,
      headers: this.headers,
      data: this.request_body,
    });
  },
};
