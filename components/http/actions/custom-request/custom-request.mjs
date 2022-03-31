import { axios } from "@pipedream/platform";
import http from "../../http.app.mjs";

export default {
  key: "http-custom-request",
  name: "Custom Request",
  description: "Make an HTTP request using any method and URL. Optionally configure query string parameters, headers and basic auth.",
  type: "action",
  version: "0.1.3",
  props: {
    http,
    url: {
      propDefinition: [
        http,
        "url",
      ],
    },
    method: {
      propDefinition: [
        http,
        "method",
      ],
    },
    data: {
      propDefinition: [
        http,
        "body",
      ],
    },
    params: {
      propDefinition: [
        http,
        "params",
      ],
    },
    headers: {
      propDefinition: [
        http,
        "headers",
      ],
    },
    basicAuthUsername: {
      propDefinition: [
        http,
        "basicAuthUsername",
      ],
    },
    basicAuthPassword: {
      propDefinition: [
        http,
        "basicAuthPassword",
      ],
    },
  },
  async run({ $ }) {
    const {
      data,
      headers,
      method,
      params,
      url,
    } = this;
    const config = {
      url,
      method,
      data,
      params,
      headers,
    };
    if (this.basicAuthUsername || this.basicAuthPassword) {
      config.auth = {};
      config.auth.username = this.basicAuthUsername;
      config.auth.password = this.basicAuthPassword;
    }
    return await axios($, config);
  },
};
