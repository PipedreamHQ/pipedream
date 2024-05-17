import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "apify",
  propDefinitions: {
    actorId: {
      type: "string",
      label: "Actor ID",
      description: "The ID of the actor to run or monitor.",
      optional: false,
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task to run or monitor.",
      optional: false,
    },
    runStatus: {
      type: "string",
      label: "Run Status",
      description: "Filter runs based on their status.",
      optional: true,
      options: [
        {
          label: "Succeeded",
          value: "SUCCEEDED",
        },
        {
          label: "Failed",
          value: "FAILED",
        },
        {
          label: "Running",
          value: "RUNNING",
        },
        {
          label: "Ready",
          value: "READY",
        },
      ],
    },
    key: {
      type: "string",
      label: "Key",
      description: "The key of the record to create or update in the key-value store.",
      optional: false,
    },
    value: {
      type: "string",
      label: "Value",
      description: "The value of the record to create or update in the key-value store.",
      optional: false,
    },
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the web page to scrape.",
      optional: false,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.apify.com/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.oauth_access_token || this.$auth.api_token}`,
        },
      });
    },
    async runActor({ actorId }) {
      return this._makeRequest({
        method: "POST",
        path: `/actors/${actorId}/runs`,
      });
    },
    async runTask({ taskId }) {
      return this._makeRequest({
        method: "POST",
        path: `/actor-tasks/${taskId}/runs`,
      });
    },
    async setKeyValueStoreRecord({
      key, value,
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/key-value-stores/default/records/${key}`,
        data: {
          value,
        },
      });
    },
    async scrapePage({ url }) {
      return this._makeRequest({
        method: "GET",
        path: `/actor-tasks/run-scraper?token=${this.$auth.api_token}&url=${encodeURIComponent(url)}`,
      });
    },
    async checkActorRunStatus({
      actorId, runId,
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/actors/${actorId}/runs/${runId}`,
      });
    },
    async checkTaskRunStatus({
      taskId, runId,
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/actor-tasks/${taskId}/runs/${runId}`,
      });
    },
  },
  version: "0.0.1",
};
