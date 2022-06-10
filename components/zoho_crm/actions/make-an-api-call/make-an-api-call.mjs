// legacy_hash_id: a_8Ki0B8
import { axios } from "@pipedream/platform";

export default {
  key: "zoho_crm-make-an-api-call",
  name: "Make API Call",
  description: "Makes an aribitrary call to Zoho CRM API.",
  version: "0.1.2",
  type: "action",
  props: {
    zoho_crm: {
      type: "app",
      app: "zoho_crm",
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
      description: "A path relative to Zoho CRM API to send the request against.",
    },
    headers: {
      type: "object",
      description: "Headers to send in the request.",
    },
    request_body: {
      type: "object",
      description: "Body of the request.",
      optional: true,
    },
  },
  async run({ $ }) {
    // See Zoho CRM API docs at: https://www.zoho.com/crm/developer/docs/api/v2/modules-api.html

    if (!this.request_method || !this.relative_url) {
      throw new Error("Must provide request_method, and relative_url parameters.");
    }

    return await axios($, {
      method: this.request_method,
      url: `${this.zoho_crm.$auth.api_domain}/${this.relative_url}`,
      headers: this.headers,
      data: this.request_body,
    });
  },
};
