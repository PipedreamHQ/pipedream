import salesforce from "../../salesforce_rest_api.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "salesforce_rest_api-salesforce-make-api-call",
  name: "Make API Call",
  description: "Makes an aribitrary call to Salesforce API",
  version: "0.2.2",
  type: "action",
  props: {
    salesforce,
    query_string: {
      type: "string",
      label: "query_string",
      description: "Query string of the request.",
      optional: true,
    },
    request_method: {
      type: "string",
      label: "request_method",
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
      label: "relative_url",
      description: "A path relative to the Salesforce instance to send the request against.",
    },
    headers: {
      type: "object",
      label: "headers",
      description: "Headers to send in the request.",
    },
    request_body: {
      type: "object",
      label: "request_body",
      description: "Body of the request.",
      optional: true,
    },
  },
  async run({ $ }) {

    this.query_string = this.query_string || "";

    return await axios($, {
      method: this.request_method,
      url: `${this.salesforce.$auth.instance_url}/services/data/${this.relative_url}${this.query_string}`,
      headers: this.headers,
      data: this.request_body,
    });
  },
};
