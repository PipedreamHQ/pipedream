import http from "../../http.app.mjs";

export default {
  key: "http-custom-request",
  name: "Send any HTTP Request",
  description: "Send an HTTP request using any method and URL. Optionally configure query string parameters, headers, and basic auth.",
  type: "action",
  version: "1.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    http,
    httpRequest: {
      propDefinition: [
        http,
        "httpRequest",
      ],
    },
    includeHeaders: {
      type: "boolean",
      label: "Include Response Headers",
      description: "Optionally export the full response headers",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.httpRequest.execute();

    if (this.includeHeaders) {
      $.export("headers", response.headers);
    }

    return response;
  },
};
