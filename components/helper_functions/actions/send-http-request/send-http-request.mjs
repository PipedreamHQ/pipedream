// legacy_hash_id: a_rJip7d
import { axios } from "@pipedream/platform";
import helper_functions from "../../helper_functions.app.mjs";

export default {
  key: "helper_functions-send-http-request",
  name: "Send Webhook",
  description: "Send Webhook and Payload",
  version: "0.1.1",
  type: "action",
  props: {
    helper_functions,
    method: {
      type: "string",
    },
    url: {
      type: "string",
    },
    query: {
      type: "string",
      optional: true,
    },
    headers: {
      type: "string",
      optional: true,
    },
    auth: {
      type: "object",
      optional: true,
    },
    responseType: {
      type: "string",
      optional: true,
    },
    payload: {
      type: "string",
    },
  },
  async run({ $ }) {
    const config = {
      method: this.method ||  "post",
      url: this.url,
    };
    for (const {
key,           value
} of this.query || []) {
      if (!config.params) config.params = {};
      config.params[key] = value;
    }
    for (const {
key,           value
} of this.headers || []) {
      if (!config.headers) config.headers = {};
      config.headers[key] = value;
    }
    if (this.auth) {
      config.auth = {
        username: this.auth.username,
        password: this.auth.password,
      };
    }
    if (this.responseType) {
      config.responseType = this.responseType;
    }
    if (this.payload) config.data = this.payload;
    return await axios($, config);
  },
};
