// legacy_hash_id: a_YEi2rp
import { axios } from "@pipedream/platform";

export default {
  key: "xero_accounting_api-make-an-api-call",
  name: "Make API Call",
  description: "Makes an aribitrary call to Xero Accounting API.",
  version: "0.1.1",
  type: "action",
  props: {
    xero_accounting_api: {
      type: "app",
      app: "xero_accounting_api",
    },
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
    query_string: {
      type: "string",
      description: "Query string of the request.",
      optional: true,
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
  // See Xero's Rest Accounting API docs at: https://developer.xero.com/documentation/api/api-overview

    if (!this.request_method || !this.relative_url) {
      throw new Error("Must provide request_method, and relative_url parameters.");
    }

    this.query_string = this.query_string || "";

    return await axios($, {
      method: this.request_method,
      url: `https://api.xero.com/${this.relative_url}${this.query_string}`,
      headers: this.headers,
      data: this.request_body,
    });
  },
};
