import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "servicem8",
  propDefinitions: {},
  methods: {
    _apiRoot() {
      return "https://api.servicem8.com";
    },
    _apiPath() {
      return "api_1.0";
    },
    _authHeaders({ json = false } = {}) {
      const headers = {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
      if (json) {
        headers["Content-Type"] = "application/json";
      }
      return headers;
    },
    /**
     * @param {object} opts
     * @param {string} opts.path - Path under API host (e.g. api_1.0/job.json,
     *   or webhook_subscriptions)
     */
    async _makeRequest({
      $ = this, path, method = "GET", data, params, headers, returnFullResponse = false,
      formUrlEncoded = false,
    }) {
      const useJsonBody = !formUrlEncoded && data && method !== "GET" && typeof data === "object";
      const config = {
        url: `${this._apiRoot()}/${path}`,
        method,
        headers: {
          ...this._authHeaders({
            json: useJsonBody,
          }),
          ...headers,
        },
        ...(params && {
          params,
        }),
        ...(data !== undefined && {
          data,
        }),
        returnFullResponse,
      };
      if (formUrlEncoded) {
        config.headers["Content-Type"] = "application/x-www-form-urlencoded";
      }
      return axios($, config);
    },
    resourceListPath(resource) {
      return `${this._apiPath()}/${resource}.json`;
    },
    resourceItemPath(resource, uuid) {
      return `${this._apiPath()}/${resource}/${uuid}.json`;
    },
    async listResource({
      $, resource, params = {},
    }) {
      return this._makeRequest({
        $,
        path: this.resourceListPath(resource),
        params,
      });
    },
    async getResource({
      $, resource, uuid,
    }) {
      return this._makeRequest({
        $,
        path: this.resourceItemPath(resource, uuid),
      });
    },
    async createResource({
      $, resource, data,
    }) {
      const res = await this._makeRequest({
        $,
        path: this.resourceListPath(resource),
        method: "POST",
        data,
        returnFullResponse: true,
      });
      const recordUuid = res.headers["x-record-uuid"] ?? res.headers["X-Record-Uuid"];
      return {
        body: res.data,
        recordUuid,
      };
    },
    async updateResource({
      $, resource, uuid, data,
    }) {
      return this._makeRequest({
        $,
        path: this.resourceItemPath(resource, uuid),
        method: "POST",
        data,
      });
    },
    async deleteResource({
      $, resource, uuid,
    }) {
      return this._makeRequest({
        $,
        path: this.resourceItemPath(resource, uuid),
        method: "DELETE",
      });
    },
    getJob(jobId) {
      return this.getResource({
        resource: "job",
        uuid: jobId,
      });
    },
    async listWebhooks({ $ }) {
      return this._makeRequest({
        $,
        path: "webhook_subscriptions",
        method: "GET",
      });
    },
    setHook({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "webhook_subscriptions",
        method: "POST",
        params,
      });
    },
    removeHook({
      $, data,
    }) {
      return this._makeRequest({
        $,
        path: "webhook_subscriptions",
        method: "DELETE",
        data,
        formUrlEncoded: true,
      });
    },
    /** Messaging API (requires publish_sms scope). [Docs](https://developer.servicem8.com/reference/send_sms) */
    async sendSms({
      $, data,
    }) {
      return this._makeRequest({
        $,
        path: "platform_service_sms",
        method: "POST",
        data,
      });
    },
    /** Messaging API (requires publish_email scope). [Docs](https://developer.servicem8.com/reference/send_email) */
    async sendEmail({
      $, data, headers,
    }) {
      return this._makeRequest({
        $,
        path: "platform_service_email",
        method: "POST",
        data,
        headers,
      });
    },
  },
};
