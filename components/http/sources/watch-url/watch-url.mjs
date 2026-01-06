import http from "../../http.app.mjs";
import hash from "object-hash";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "http-watch-url",
  name: "New event when the content of the URL changes.",
  description: "Emit new event when the content of the URL changes.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    http,
    timer: {
      type: "$.interface.timer",
      label: "Watching timer",
      description: "How often to watch the URL.",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    httpRequest: {
      type: "http_request",
      label: "HTTP Request Configuration",
      description: "HTTP Request Configuration",
      default: {
        method: "GET",
      },
    },
    emitBodyOnly: {
      label: "Emit body only",
      description: "If set as true the emitted item will contain only the response body, otherwise, it will include the request status code.",
      type: "boolean",
      default: true,
    },
    emitAsArray: {
      label: "Emit as array",
      description: "If the request responds with an array, this source will emit changes individually for each item of the array.",
      type: "boolean",
      default: false,
    },
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
        return this.emitAny(event, response);
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
      const ts = event.timestamp || Math.round(Date.now() / 1000);
      this.$emit(meta, {
        id: hash(meta),
        summary: `Requested at ${ts}`,
        ts,
      });
    },
  },
  async run(event) {
    const response = await this.httpRequest.execute();
    if (this.emitAsArray) {
      this.emitArray(event, response);
    } else {
      this.emitAny(event, response);
    }
  },
};
