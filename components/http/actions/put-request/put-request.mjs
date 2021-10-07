import { axios } from "@pipedream/platform";
import http from "../../http.app.mjs";

export default {
  key: "http-put-request",
  name: "PUT Request",
  description: "Make an HTTP PUT request to any URL. Optionally configure query string parameters, headers and basic auth.",
  type: "action",
  version: "0.1.1",
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
  methods: {},
  async run({ $ }) {
    const {
      data,
      headers,
      params,
      url,
    } = this;
    const config = {
      url,
      method: "PUT",
      data,
      params,
      headers,
    };
    if (this.auth) config.auth = this.http.parseAuth(this.auth);
    return await axios($, config);
  },
}
;
