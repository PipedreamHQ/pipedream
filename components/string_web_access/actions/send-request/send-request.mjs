import app from "../../string_web_access.app.mjs";

export default {
  key: "string_web_access-send-request",
  name: "Send Request To URL",
  description: "Send a request with a body to a URL, such as a form submission or an API write, and return the response. [See the documentation](https://portal.usestring.ai/docs/api-reference/fetch)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    app,
    url: {
      propDefinition: [
        app,
        "url",
      ],
      description: "The endpoint to call, e.g. `https://api.example.com/v1/orders`",
    },
    method: {
      type: "string",
      label: "Method",
      description: "The HTTP method to use: `POST`, `PUT` or `PATCH`, e.g. `POST`. A body is only valid on these three.",
      options: [
        "POST",
        "PUT",
        "PATCH",
      ],
      default: "POST",
    },
    body: {
      type: "object",
      label: "Body",
      description: "The request body, e.g. `{\"name\": \"Jane Doe\", \"plan\": \"pro\"}`. Objects are JSON-stringified before sending.",
    },
    format: {
      propDefinition: [
        app,
        "format",
      ],
      default: "json",
    },
    headers: {
      propDefinition: [
        app,
        "headers",
      ],
      description: "Request headers to forward, e.g. an `Authorization` header for the destination",
    },
  },
  async run({ $ }) {
    const response = await this.app.fetchUrl({
      $,
      data: {
        url: this.url,
        method: this.method,
        body: this.body,
        format: this.format ?? "json",
        headers: this.headers,
      },
    });

    $.export("$summary", `Successfully sent a ${this.method} request to ${this.url}`);
    return response;
  },
};
