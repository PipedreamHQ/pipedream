import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "mistral_ai",
  propDefinitions: {
    fileIds: {
      type: "string[]",
      label: "File IDs",
      description: "Array of input file UUIDs for batch processing",
      async options({ page }) {
        const { data } = await this.listFiles({
          params: {
            page,
            page_size: constants.DEFAULT_PAGE_SIZE,
          },
        });
        return data?.map(({
          id: value, filename: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    modelId: {
      type: "string",
      label: "Model ID",
      description: "The identifier of the model to use",
      async options() {
        const { data } = await this.listModels();
        return data?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.mistral.ai/v1";
    },
    _makeRequest({
      $ = this,
      path,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
        },
      });
    },
    listModels(opts = {}) {
      return this._makeRequest({
        path: "/models",
        ...opts,
      });
    },
    listBatchJobs(opts = {}) {
      return this._makeRequest({
        path: "/batch/jobs",
        ...opts,
      });
    },
    listFiles(opts = {}) {
      return this._makeRequest({
        path: "/files",
        ...opts,
      });
    },
    createEmbeddings(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/embeddings",
        ...opts,
      });
    },
    sendPrompt(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/chat/completions",
        ...opts,
      });
    },
    createBatchJob(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/batch/jobs",
        ...opts,
      });
    },
    async *paginate({
      fn,
      params = {},
      max,
    }) {
      params = {
        ...params,
        page: 0,
        page_size: constants.DEFAULT_PAGE_SIZE,
      };
      let total, count = 0;
      do {
        const { data } = await fn({
          params,
        });
        for (const item of data) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        total = data?.length;
        params.page++;
      } while (total);
    },
  },
};
