import http from "../../http.app.mjs";

export default {
  key: "http-custom-request",
  name: "Send any HTTP Request",
  description: "Send an HTTP request using any method and URL. Optionally configure query string parameters, headers, and basic auth.",
  type: "action",
  version: "1.1.0",
  props: {
    http,
    httpRequest: {
      propDefinition: [
        http,
        "httpRequest",
      ],
    },
  },
  async run() {
    const response = await this.httpRequest.execute();

    return {
      headers: response.headers,
      data: response,
    };
  },
};
