import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "papertrail",
  propDefinitions: {
    systemId: {
      type: "string",
      label: "System ID",
      description: "Papertrail system ID",
      optional: true,
      async options() {
        const systems = await this.listSystems();
        return (systems || []).map((s) => ({
          value: String(s.id),
          label: `${s.name} (${s.id})`,
        }));
      },
    },
    groupId: {
      type: "string",
      label: "Group ID",
      description: "The ID of the group",
      optional: true,
      async options() {
        const groups = await this.listGroups();
        return (groups || []).map((g) => ({
          value: String(g.id),
          label: `${g.name} (${g.id})`,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://papertrailapp.com/api/v1";
    },
    _headers(headers = {}) {
      return {
        "X-Papertrail-Token": `${this.$auth.api_token}`,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    } = {}) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(headers),
        ...opts,
      });
    },
    searchEvents(opts = {}) {
      return this._makeRequest({
        path: "/events/search.json",
        ...opts,
      });
    },
    listGroups(opts = {}) {
      return this._makeRequest({
        path: "/groups.json",
        ...opts,
      });
    },
    listSystems(opts = {}) {
      return this._makeRequest({
        path: "/systems.json",
        ...opts,
      });
    },
    getSystem({
      systemId, ...opts
    }) {
      return this._makeRequest({
        path: `/systems/${systemId}.json`,
        ...opts,
      });
    },
    registerSystem({
      $, formParams,
    }) {
      const body = new URLSearchParams();
      for (const [
        key,
        value,
      ] of Object.entries(formParams)) {
        if (value === undefined || value === null || value === "") continue;
        body.append(key, String(value));
      }
      return this._makeRequest({
        $,
        method: "POST",
        path: "/systems.json",
        data: body.toString(),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
    },
  },
};
