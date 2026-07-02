import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "yutori",
  description: "Yutori's API is an AI web agent platform. Give it a task and it browses the web, fills forms, extracts data, and completes multi-step workflows using a real cloud browser — or runs deep research across 100+ sources. You can also create Scouts: recurring monitors that watch any part of the web on a schedule and alert you when something relevant happens.",
  propDefinitions: {
    query: {
      type: "string",
      label: "Query",
      description: "Natural language description of what to monitor or research",
    },
    userTimezone: {
      type: "string",
      label: "Timezone",
      description: "Your timezone, e.g. `America/Los_Angeles`",
      optional: true,
    },
    userLocation: {
      type: "string",
      label: "Location",
      description: "Your location, e.g. `San Francisco, CA, US`",
      optional: true,
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "URL to receive a notification when the task completes",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.yutori.com/v1";
    },
    _headers() {
      return {
        "X-API-Key": this.$auth.api_key,
        "Content-Type": "application/json",
      };
    },
    async _request(ctx, opts = {}) {
      return axios(ctx, {
        ...opts,
        url: this._baseUrl() + opts.path,
        headers: this._headers(),
      });
    },
    // Browsing
    async createBrowsingTask(ctx, data) {
      return this._request(ctx, {
        method: "POST",
        path: "/browsing/tasks",
        data,
      });
    },
    async getBrowsingTask(ctx, taskId) {
      return this._request(ctx, {
        method: "GET",
        path: `/browsing/tasks/${encodeURIComponent(taskId)}`,
      });
    },
    // Research
    async createResearchTask(ctx, data) {
      return this._request(ctx, {
        method: "POST",
        path: "/research/tasks",
        data,
      });
    },
    async getResearchTask(ctx, taskId) {
      return this._request(ctx, {
        method: "GET",
        path: `/research/tasks/${encodeURIComponent(taskId)}`,
      });
    },
    // Scouting
    async createScout(ctx, data) {
      return this._request(ctx, {
        method: "POST",
        path: "/scouting/tasks",
        data,
      });
    },
    async listScouts(ctx, params = {}) {
      return this._request(ctx, {
        method: "GET",
        path: "/scouting/tasks",
        params,
      });
    },
    async getScout(ctx, scoutId) {
      return this._request(ctx, {
        method: "GET",
        path: `/scouting/tasks/${encodeURIComponent(scoutId)}`,
      });
    },
    async markScoutDone(ctx, scoutId) {
      return this._request(ctx, {
        method: "POST",
        path: `/scouting/tasks/${encodeURIComponent(scoutId)}/done`,
      });
    },
    async restartScout(ctx, scoutId) {
      return this._request(ctx, {
        method: "POST",
        path: `/scouting/tasks/${encodeURIComponent(scoutId)}/restart`,
      });
    },
    async deleteScout(ctx, scoutId) {
      return this._request(ctx, {
        method: "DELETE",
        path: `/scouting/tasks/${encodeURIComponent(scoutId)}`,
      });
    },
    async getScoutUpdates(ctx, scoutId, params = {}) {
      return this._request(ctx, {
        method: "GET",
        path: `/scouting/tasks/${encodeURIComponent(scoutId)}/updates`,
        params,
      });
    },
    async getUpdates(ctx, params = {}) {
      return this._request(ctx, {
        method: "GET",
        path: "/scouting/updates",
        params,
      });
    },
  },
};
