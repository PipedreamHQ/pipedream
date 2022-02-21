import { axios } from "@pipedream/platform";
import http from "../../http.app.mjs";

export default {
  key: "http-post-request",
  name: "POST Request",
  description: "Make an HTTP POST request to any URL. Optionally configure query string parameters, headers and basic auth.",
  type: "action",
  version: "0.1.2",
  props: {
    http,
    url: {
      propDefinition: [
        http,
        "url",
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
    auth: {
      propDefinition: [
        http,
        "auth",
      ],
    },
  },
  async run({ $ }) {
    const {
      data,
      headers,
      params,
      url,
    } = this;
    const config = {
      url,
      method: "POST",
      data,
      params,
      headers,
    };
    if (this.auth) config.auth = this.http.parseAuth(this.auth);
    return await axios($, config);
  },
}
;
