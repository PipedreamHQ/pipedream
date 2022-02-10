import { axios } from "@pipedream/platform";
import http from "../../http.app.mjs";

export default {
  key: "http-get-request",
  name: "GET Request",
  description: "Make an HTTP GET request to any URL. Optionally configure query string parameters, headers and basic auth.",
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
      headers,
      params,
      url,
    } = this;
    const config = {
      url,
      method: "GET",
      params,
      headers,
    };
    if (this.auth) config.auth = this.http.parseAuth(this.auth);
    return await axios($, config);
  },
}
;
