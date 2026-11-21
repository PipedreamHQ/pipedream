import { axios } from "@pipedream/platform";
import {
  buildImageRequestBody,
  buildVideoRequestBody,
  parseModelIds,
} from "./common/payloads.mjs";

const CLIENT_HEADER_VALUE = "taodock-pipedream/0.0.1";
const DEFAULT_POLL_INTERVAL_MS = 5000;
const VIDEO_DOWNLOAD_TIMEOUT_MS = 10 * 60 * 1000;

export default {
  type: "app",
  app: "taodock",
  propDefinitions: {
    model: {
      type: "string",
      label: "Model",
      description:
        "The Taodock model ID to use. The list is loaded live from your account ([model catalog](https://taodock.com/models)).",
      async options() {
        const ids = await this.listModelIds();
        return ids.map((id) => ({
          label: id,
          value: id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://taodock.com/v1";
    },
    _authHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "X-TaoDock-Client": CLIENT_HEADER_VALUE,
      };
    },
    async _makeRequest({
      $ = this,
      method = "GET",
      path,
      data,
      responseType,
      timeout,
      returnFullResponse = false,
    }) {
      const config = {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: this._authHeaders(),
        returnFullResponse,
        ...(data !== undefined
          ? {
            data,
          }
          : {}),
        ...(responseType !== undefined
          ? {
            responseType,
          }
          : {}),
        ...(timeout !== undefined
          ? {
            timeout,
          }
          : {}),
      };
      try {
        return await axios($, config);
      } catch (error) {
        throw new Error(this._errorMessage(error));
      }
    },
    _errorMessage(error) {
      const body = error?.response?.data ?? error?.data;
      if (typeof body === "string" && body.trim()) {
        return `Taodock API error: ${body.trim().slice(0, 500)}`;
      }
      if (body && typeof body === "object") {
        const message = body.error?.message ?? body.message;
        if (typeof message === "string" && message) {
          return `Taodock API error: ${message}`;
        }
      }
      return `Taodock API error: ${error?.message ?? "unknown error"}`;
    },
    async listModelIds({ $ } = {}) {
      const response = await this._makeRequest({
        $,
        method: "GET",
        path: "/models",
      });
      return parseModelIds(response);
    },
    async generateImage({
      $, model, prompt, settings,
    }) {
      return await this._makeRequest({
        $,
        method: "POST",
        path: "/images/generations",
        data: buildImageRequestBody(model, prompt, settings),
      });
    },
    async createVideoTask({
      $, model, prompt, settings,
    }) {
      return await this._makeRequest({
        $,
        method: "POST",
        path: "/videos",
        data: buildVideoRequestBody(model, prompt, settings),
      });
    },
    async getVideoTask({ $, taskId }) {
      return await this._makeRequest({
        $,
        method: "GET",
        path: `/videos/${encodeURIComponent(taskId)}`,
      });
    },
    async downloadVideoContent({ $, taskId }) {
      return await this._makeRequest({
        $,
        method: "GET",
        path: `/videos/${encodeURIComponent(taskId)}/content`,
        responseType: "arraybuffer",
        timeout: VIDEO_DOWNLOAD_TIMEOUT_MS,
        returnFullResponse: true,
      });
    },
    _pollIntervalMs() {
      return DEFAULT_POLL_INTERVAL_MS;
    },
  },
};
