import http from "../../http.app.mjs";

export default {
  key: "http-custom-request",
  name: "Custom Request",
  description: "Make an HTTP request using any method and URL. Optionally configure query string parameters, headers and basic auth.",
  type: "action",
  version: "1.0.0",
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
    return await this.httpRequest.execute();
  },
};
