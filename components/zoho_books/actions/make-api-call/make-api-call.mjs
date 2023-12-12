// legacy_hash_id: a_PNinw1
import { axios } from "@pipedream/platform";

export default {
  key: "zoho_books-make-api-call",
  name: "Make API Call",
  description: "Makes an aribitrary call to Zoho Books API",
  version: "0.3.1",
  type: "action",
  props: {
    zoho_books: {
      type: "app",
      app: "zoho_books",
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
      description: "A path relative to Zoho Books to send the request against.",
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
  // See the API docs: https://www.zoho.com/books/api/v3/#introduction

    this.query_string = this.query_string || "";

    return await axios($, {
      method: this.request_method,
      url: `https://books.${this.zoho_books.$auth.base_api_uri}/api/v3/${this.relative_url}${this.query_string}`,
      headers: this.headers,
      data: this.request_body,
    });
  },
};
