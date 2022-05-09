import http from "../../http.app.mjs";
import axios from "axios";
import hash from "object-hash";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "http-watch-url",
  name: "New item from Watching URL",
  description: "Emit new item when the response of the watched URL changes.",
  version: "0.0.1",
  type: "source",
  props: {
    timer: {
      type: "$.interface.timer",
      label: "Watching timer",
      description: "How often to watch the URL.",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    method: {
      label: "Method",
      description: "The configured HTTP Method for this request.",
      type: "string",
      default: "GET",
      options: [
        "GET",
        "POST",
        "PUT",
        "DELETE",
      ],
    },
    url: {
      label: "URL",
      description: "The watched URL.",
      type: "string",
    },
    params: {
      label: "Query params",
      description: "Data to be sent on the `Request URL` as query parameters.",
      type: "object",
      optional: true,
      default: {},
    },
    body: {
      label: "Body",
      description: "Data to be sent on the `Request Body`.",
      type: "string",
      optional: true,
    },
    headers: {
      label: "Headers",
      description: "Headers to be sent on the `Request Headers`.",
      type: "object",
      optional: true,
      default: {},
    },
    emitAsArray: {
      label: "Emit as array",
      description: "Is expected that the provided URL should return a JSON Array, on this case this source will emit changes individually for each item of the array",
      type: "boolean",
      optional: false,
    },
    emitBodyOnly: {
      label: "Emit body only",
      description: "If set as true the emitted item will contain only the body, else it will also contain status information of the request.",
      type: "boolean",
      optional: false,
    },
    http,
  },
  methods: {
    getMeta(data, status) {
      if (this.emitBodyOnly) {
        return data;
      }
      return {
        data,
        status,
      };
    },
    emitArray(event, response) {
      if (!Array.isArray(response.data)) {
        throw new ConfigurationError("Response is not a JSON Array.");
      }
      for (const item of response.data) {
        const meta = this.getMeta(item, response.status);
        this.emit(event, meta);
      }
    },
    emitAny(event, response) {
      const meta = this.getMeta(response.data, response.status);
      this.emit(event, meta);
    },
    emit(event, meta) {
      const timestamp = event.timestamp || Math.round(Date.now() / 1000);
      const summary = `${timestamp} ${this.method} ${this.url} `;
      this.$emit(meta, {
        summary,
        id: hash(meta),
      });
    },
  },
  async run(event) {
    const headers = {
      "User-Agent": "pipedream/1",
      ...this.headers,
    };
    const data = this.body || undefined;
    const params = this.params || undefined;

    const response = await axios({
      method: this.method,
      url: this.url,
      params,
      data,
      headers,
    });

    if (this.emitAsArray) {
      this.emitArray(event, response);
    } else {
      this.emitAny(event, response);
    }
  },
};
