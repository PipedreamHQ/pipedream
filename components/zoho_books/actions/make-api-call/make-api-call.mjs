// legacy_hash_id: a_PNinw1
import { checkUrl } from "../../common/utils.mjs";
import zohoBooks from "../../zoho_books.app.mjs";

export default {
  key: "zoho_books-make-api-call",
  name: "Make API Call",
  description: "Makes an aribitrary call to Zoho Books API",
  version: "0.4.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    zohoBooks,
    queryString: {
      type: "string",
      label: "Query String",
      description: "Query string of the request.",
      optional: true,
    },
    requestMethod: {
      type: "string",
      label: "Request Method",
      description: "Http method to use in the request.",
      options: [
        "get",
        "post",
        "put",
        "patch",
        "delete",
      ],
    },
    relativeUrl: {
      type: "string",
      label: "Relative Url",
      description: "A path relative to Zoho Books to send the request against. For example, use `/expenses` for [List Expenses API](https://www.zoho.com/books/api/v3/expenses/#list-expenses). [See the documentation](https://www.zoho.com/books/api/v3/introduction/)",
    },
    headers: {
      type: "object",
      label: "Headers",
      description: "Headers to send in the request.",
      optional: true,
    },
    requestBody: {
      type: "object",
      label: "Request Body",
      description: "Body of the request.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.zohoBooks._makeRequest({
      $,
      path: checkUrl(this.relativeUrl),
      params: this.queryString,
      method: this.requestMethod,
      headers: this.headers,
      data: this.requestBody,
    });

    $.export("$summary", `Successfully called the path: ${this.relativeUrl}`);
    return response;
  },
};
