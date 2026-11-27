import { axios } from "@pipedream/platform";
import {
  BASE_URL,
  MODALITY_OPTIONS,
  TASK_STATE_OPTIONS,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "popnow",
  propDefinitions: {
    modality: {
      type: "string",
      label: "Modality",
      description: "Only list models that produce this kind of output, e.g. `image`.",
      options: MODALITY_OPTIONS,
      optional: true,
    },
    model: {
      type: "string",
      label: "Model",
      description: "The model call name, for example `alibaba/z-image-turbo/text-to-image`. Use the **List Models** action to browse the catalog.",
      async options({ modality }) {
        const { items = [] } = await this.listModels({
          params: {
            modality,
          },
        });
        return items.map(({
          model, displayName,
        }) => ({
          label: displayName
            ? `${displayName} (${model})`
            : model,
          value: model,
        }));
      },
    },
    input: {
      type: "object",
      label: "Input",
      description: "The model input as a JSON object, validated against the model's input schema. Use the **Get Model** action to see the fields a model accepts, for example `{\"prompt\": \"a red fox in the snow\"}`.",
    },
    callBackUrl: {
      type: "string",
      label: "Callback URL",
      description: "A public HTTPS endpoint that receives the final task record when the task finishes, e.g. `https://example.com/popnow-webhook`. [See the documentation](https://popnow.ai/docs/webhooks)",
      optional: true,
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task, as returned by the **Create Job** action, e.g. `job_06gty996k7x2bp2nxa1dyea170`.",
      async options({ prevContext }) {
        const {
          items = [], hasMore, nextCursor,
        } = await this.listJobs({
          params: {
            limit: 50,
            cursor: prevContext?.cursor,
          },
        });
        return {
          options: items.map(({
            taskId, model, state,
          }) => ({
            label: `${model} - ${state} - ${taskId}`,
            value: taskId,
          })),
          context: hasMore && nextCursor
            ? {
              cursor: nextCursor,
            }
            : {},
        };
      },
    },
    state: {
      type: "string",
      label: "State",
      description: "Only return tasks in this state, e.g. `succeeded`.",
      options: TASK_STATE_OPTIONS,
      optional: true,
    },
    from: {
      type: "string",
      label: "From",
      description: "Inclusive start date in UTC, formatted as `YYYY-MM-DD`, e.g. `2026-11-01`.",
      optional: true,
    },
    to: {
      type: "string",
      label: "To",
      description: "Exclusive end date in UTC, formatted as `YYYY-MM-DD`, e.g. `2026-11-08`.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return BASE_URL;
    },
    _headers(headers = {}) {
      return {
        ...headers,
        "Authorization": `Bearer ${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this, path, headers, ...opts
    } = {}) {
      const response = await axios($, {
        ...opts,
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(headers),
      });
      // Every PopNow response is wrapped as { code, msg, data, request_id }.
      if (response && typeof response === "object" && typeof response.code === "number") {
        if (response.code !== 200) {
          throw new Error(`PopNow API error ${response.code}: ${response.msg || "Request failed"} (request ID: ${response.request_id || "unknown"})`);
        }
        return response.data;
      }
      return response;
    },
    listModels(opts = {}) {
      return this._makeRequest({
        path: "/api/v1/models",
        ...opts,
      });
    },
    getModel({
      model, ...opts
    } = {}) {
      const path = model.split("/").map(encodeURIComponent)
        .join("/");
      return this._makeRequest({
        path: `/api/v1/models/${path}`,
        ...opts,
      });
    },
    quoteJob(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/v1/jobs/quote",
        ...opts,
      });
    },
    createJob(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/v1/jobs/createTask",
        ...opts,
      });
    },
    getJob({
      taskId, ...opts
    } = {}) {
      return this._makeRequest({
        path: "/api/v1/jobs/recordInfo",
        params: {
          taskId,
        },
        ...opts,
      });
    },
    listJobs(opts = {}) {
      return this._makeRequest({
        path: "/api/v1/jobs",
        ...opts,
      });
    },
    getUsage(opts = {}) {
      return this._makeRequest({
        path: "/api/v1/usage",
        ...opts,
      });
    },
  },
};
