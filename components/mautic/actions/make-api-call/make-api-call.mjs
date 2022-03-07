// legacy_hash_id: a_0Mi22b
import { axios } from "@pipedream/platform";

export default {
  key: "mautic-make-api-call",
  name: "Make API Call",
  description: "Makes an aribitrary call to Mautic API",
  version: "0.1.1",
  type: "action",
  props: {
    mautic: {
      type: "app",
      app: "mautic",
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
      description: "A path relative to Mautic, to send the request against.",
    },
    headers: {
      type: "object",
      description: "Headers to send in the request.",
    },
    query_string: {
      type: "string",
      description: "Query string of the request.",
      optional: true,
    },
    request_body: {
      type: "object",
      description: "Body of the request.",
      optional: true,
    },
  },
  async run({ $ }) {
  // See the API docs: https://developer.mautic.org/#introduction

    if (!this.request_method || !this.relative_url || !this.headers) {
      throw new Error("Must provide request_method, relative_url, and headers parameters.");
    }

    this.query_string = this.query_string || "";

    return await axios($, {
      method: this.request_method,
      url: `${this.mautic.$auth.mautic_url}/api/${this.relative_url}${this.query_string}`,
      headers: this.headers,
      data: this.request_body,
    });
  },
};
