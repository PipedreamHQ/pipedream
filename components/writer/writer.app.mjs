// x-pd-ai: optimized
import { axios } from "@pipedream/platform";
import {
  MAX_RESULTS,
  PAGE_LIMIT,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "writer",
  propDefinitions: {
    messages: {
      type: "string",
      label: "Messages",
      description: "JSON array of chat messages. Each message is `{ \"role\": ..., \"content\": ... }` where role is one of `user`, `assistant`, `system`, or `tool`. Example: `[{ \"role\": \"system\", \"content\": \"You are a concise copywriter.\" }, { \"role\": \"user\", \"content\": \"Write a 2-sentence welcome message.\" }]`.",
    },
    maxTokens: {
      type: "integer",
      label: "Max Tokens",
      description: "Maximum number of tokens the model may generate in the response.",
      optional: true,
    },
    applicationId: {
      type: "string",
      label: "Application ID",
      description: "The UUID of a no-code application (agent). Discover ids with **List Applications**; inspect an agent's required input schema with **Get Application** before running it.",
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of results to return.",
      optional: true,
      default: MAX_RESULTS,
      min: 1,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.writer.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
          ...headers,
        },
      });
    },
    /**
     * Walk a cursor-paginated Writer list endpoint and return the accumulated
     * records. Writer wraps list responses in `{ data, has_more, last_id }` and
     * pages via an `after` cursor; this calls `resourceFn` (e.g. `listApplications`
     * or `listKnowledgeGraphs`) once per page until `has_more` is false or `max`
     * records have been collected.
     *
     * @param {function} resourceFn - an app list method that takes `{ $, params }`
     *   and returns one page of the `{ data, has_more, last_id }` envelope
     */
    async paginate({
      $, resourceFn, params = {}, limit = PAGE_LIMIT, max = MAX_RESULTS,
    } = {}) {
      const results = [];
      let after;
      while (results.length < max) {
        const page = await resourceFn.call(this, {
          $,
          params: {
            ...params,
            limit,
            after,
          },
        });
        const batch = page?.data ?? [];
        if (batch.length === 0) {
          break;
        }
        results.push(...batch);
        if (!page.has_more) {
          break;
        }
        after = page.last_id ?? batch[batch.length - 1].id;
      }
      return results.slice(0, max);
    },
    async listModels(args = {}) {
      return this._makeRequest({
        path: "/models",
        ...args,
      });
    },
    async listApplications(args = {}) {
      return this._makeRequest({
        path: "/applications",
        ...args,
      });
    },
    async listKnowledgeGraphs(args = {}) {
      return this._makeRequest({
        path: "/graphs",
        ...args,
      });
    },
    async getApplication({
      applicationId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/applications/${applicationId}`,
        ...args,
      });
    },
    async runApplication({
      applicationId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/applications/${applicationId}`,
        method: "post",
        ...args,
      });
    },
    async askKnowledgeGraph(args = {}) {
      return this._makeRequest({
        path: "/graphs/question",
        method: "post",
        ...args,
      });
    },
    async sendPrompt(args = {}) {
      return this._makeRequest({
        path: "/chat",
        method: "post",
        ...args,
      });
    },
  },
};
