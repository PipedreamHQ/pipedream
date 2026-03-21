"use strict";

const logic = require("./servicem8.app.logic.js");

module.exports = function createMethods(axios) {
  return {
    _apiRoot() {
      return "https://api.servicem8.com";
    },
    _apiPath() {
      return logic.API_PATH;
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
      return logic.resourceListPath(resource);
    },
    resourceItemPath(resource, uuid) {
      return logic.resourceItemPath(resource, uuid);
    },
    buildListQueryParams(opts) {
      return logic.buildListQueryParams(opts);
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
      $, data,
    }) {
      return this._makeRequest({
        $,
        path: "webhook_subscriptions",
        method: "POST",
        data,
        formUrlEncoded: true,
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
    async _uuidOptionsForResource({
      $, resource, prevContext,
    }) {
      const params = {};
      if (prevContext?.cursor) {
        params.cursor = prevContext.cursor;
      }
      const data = await this.listResource({
        $,
        resource,
        params,
      });
      const rows = Array.isArray(data)
        ? data
        : (data && typeof data === "object" && Array.isArray(data.items))
          ? data.items
          : [];
      const nextCursor = (data && typeof data === "object" && !Array.isArray(data))
        ? (data.cursor ?? data.next_cursor)
        : undefined;
      const context = {};
      if (nextCursor) {
        context.cursor = nextCursor;
      }
      return {
        options: rows
          .map((row) => {
            const value = row.uuid ?? row.UUID;
            if (!value) {
              return null;
            }
            const label =
              row.name
              ?? row.company_name
              ?? row.job_address
              ?? row.subject
              ?? row.title
              ?? String(value);
            return {
              label,
              value,
            };
          })
          .filter(Boolean),
        context,
      };
    },
  };
};
