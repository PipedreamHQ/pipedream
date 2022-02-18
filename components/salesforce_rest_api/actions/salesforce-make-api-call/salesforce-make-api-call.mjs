// legacy_hash_id: a_vgi4Mb
import { axios } from "@pipedream/platform";

export default {
  key: "salesforce_rest_api-salesforce-make-api-call",
  name: "Make API Call",
  description: "Makes an aribitrary call to Salesforce API",
  version: "0.2.1",
  type: "action",
  props: {
    salesforce_rest_api: {
      type: "app",
      app: "salesforce_rest_api",
    },
    query_string: {
      type: "string",
      description: "Query string of the request.",
      optional: true,
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
      description: "A path relative to the Salesforce instance to send the request against.",
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

    this.query_string = this.query_string || "";

    return await axios($, {
      method: this.request_method,
      url: `${this.salesforce_rest_api.$auth.instance_url}/services/data/${this.relative_url}${this.query_string}`,
      headers: this.headers,
      data: this.request_body,
    });
  },
};
