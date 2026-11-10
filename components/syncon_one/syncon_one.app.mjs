import { axios } from "@pipedream/platform";

/**
 * Syncon One: the AI customer experience platform. This app file is the one place that talks to
 * its public API (/api/v1). The key is the user's own, so what a component can read or change is
 * decided by the API: the key's scopes, its role, and record visibility.
 */
export default {
  type: "app",
  app: "syncon_one",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://synconone.com/api/v1";
    },
    _headers() {
      return { Authorization: `Bearer ${this.$auth.api_key}` };
    },
    _makeRequest({ $ = this, path, ...args }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    /** One record by its public id, or null when the key cannot see it or it is gone. */
    async getById({ $, path, id }) {
      try {
        const response = await this._makeRequest({ $, path: `${path}/${encodeURIComponent(id)}` });
        return response.data;
      } catch (error) {
        if (error?.response?.status === 404) return null;
        throw error;
      }
    },
    create({ $, path, data }) {
      return this._makeRequest({ $, path, method: "POST", data });
    },
    update({ $, path, id, data }) {
      return this._makeRequest({
        $,
        path: `${path}/${encodeURIComponent(id)}`,
        method: "PATCH",
        data,
      });
    },
    archive({ $, path, id }) {
      return this._makeRequest({ $, path: `${path}/${encodeURIComponent(id)}`, method: "DELETE" });
    },
    subscribe({ $, url, events }) {
      return this._makeRequest({
        $,
        path: "/webhooks",
        method: "POST",
        data: { url, events, description: "Pipedream" },
      });
    },
    async unsubscribe({ $, id }) {
      try {
        await this._makeRequest({
          $,
          path: `/webhooks/${encodeURIComponent(id)}`,
          method: "DELETE",
        });
      } catch (error) {
        if (error?.response?.status !== 404) throw error;
      }
    },
  },
};
