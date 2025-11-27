import { axios } from "@pipedream/platform";
import {
  API_VERSION, DEFAULT_LIMIT,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "sanity",
  propDefinitions: {
    dataset: {
      type: "string",
      label: "Dataset",
      description: "The dataset to use",
    },
    documentId: {
      type: "string",
      label: "Document ID",
      description: "The document ID to use",
      async options({
        dataset, page,
      }) {
        const response = await this.queryDataset({
          dataset,
          params: {
            query: `* | order(_id) [${DEFAULT_LIMIT * page}...${DEFAULT_LIMIT * (page + 1)}]`,
          },
        });
        return response.result?.map(({ _id }) => _id) || [];
      },
    },
  },
  methods: {
    _projectId() {
      return this.$auth.project_id;
    },
    _baseUrl(version = API_VERSION) {
      return `https://${this._projectId()}.api.sanity.io/${version}`;
    },
    _makeRequest({
      $ = this, path, version, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl(version)}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_token}`,
          "Content-Type": "application/json",
        },
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        path: `/hooks/projects/${this._projectId()}`,
        method: "POST",
        ...opts,
      });
    },
    deleteWebhook({
      hookId, ...opts
    }) {
      return this._makeRequest({
        path: `/hooks/projects/${this._projectId()}/${hookId}`,
        method: "DELETE",
        ...opts,
      });
    },
    getDocument({
      dataset, documentId, ...opts
    }) {
      return this._makeRequest({
        path: `/data/doc/${dataset}/${documentId}`,
        ...opts,
      });
    },
    queryDataset({
      dataset, ...opts
    }) {
      return this._makeRequest({
        path: `/data/query/${dataset}`,
        ...opts,
      });
    },
    createDocument({
      dataset, ...opts
    }) {
      return this._makeRequest({
        path: `/data/actions/${dataset}`,
        method: "POST",
        ...opts,
      });
    },
  },
};
