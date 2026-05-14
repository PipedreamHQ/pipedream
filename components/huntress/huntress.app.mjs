import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "huntress",
  propDefinitions: {
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "The unique identifier for the organization.",
      async options({ prevContext }) {
        const pageToken = prevContext?.nextPageToken;
        if (pageToken === null) {
          return [];
        }
        const response = await this.listOrganizations({
          params: {
            limit: 100,
            page_token: pageToken,
          },
        });
        const items = response?.organizations ?? [];
        return {
          options: items.map(({
            id, name,
          }) => ({
            label: name ?? String(id),
            value: id,
          })),
          context: {
            nextPageToken: response?.pagination?.next_page_token ?? null,
          },
        };
      },
    },
    agentId: {
      type: "string",
      label: "Agent ID",
      description: "The unique identifier for an agent.",
      async options({
        prevContext, organizationId,
      }) {
        const pageToken = prevContext?.nextPageToken;
        if (pageToken === null) {
          return [];
        }
        const response = await this.listAgents({
          params: {
            limit: 100,
            page_token: pageToken,
            organization_id: organizationId,
          },
        });
        const items = response?.agents ?? [];
        return {
          options: items.map(({
            id, hostname, platform,
          }) => ({
            label: hostname
              ? `${hostname}${platform
                ? ` (${platform})`
                : ""}`
              : String(id),
            value: id,
          })),
          context: {
            nextPageToken: response?.pagination?.next_page_token ?? null,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    _auth() {
      const {
        api_key: username,
        api_secret_key: password,
      } = this.$auth;
      return {
        username,
        password,
      };
    },
    _makeRequest({
      $ = this, path, ...args
    } = {}) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        auth: this._auth(),
        ...args,
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    patch(args = {}) {
      return this._makeRequest({
        method: "PATCH",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        ...args,
      });
    },
    listIncidentReports(args = {}) {
      return this._makeRequest({
        path: "/incident_reports",
        ...args,
      });
    },
    listAgents(args = {}) {
      return this._makeRequest({
        path: "/agents",
        ...args,
      });
    },
    listOrganizations(args = {}) {
      return this._makeRequest({
        path: "/organizations",
        ...args,
      });
    },
    createOrganization(args = {}) {
      return this.post({
        path: "/organizations",
        ...args,
      });
    },
    updateOrganization({
      id, ...args
    }) {
      return this.patch({
        path: `/organizations/${id}`,
        ...args,
      });
    },
    deleteOrganization({
      id, ...args
    }) {
      return this.delete({
        path: `/organizations/${id}`,
        ...args,
      });
    },
    listEscalations(args = {}) {
      return this._makeRequest({
        path: "/escalations",
        ...args,
      });
    },
    listIdentities(args = {}) {
      return this._makeRequest({
        path: "/identities",
        ...args,
      });
    },
    executeSiemQuery(args = {}) {
      return this.post({
        path: "/siem/query",
        ...args,
      });
    },
    async paginate({
      fn, fnArgs = {}, keyField,
    } = {}) {
      const results = [];
      let pageToken;
      do {
        const response = await fn({
          ...fnArgs,
          params: {
            ...fnArgs.params,
            limit: constants.DEFAULT_LIMIT,
            page_token: pageToken,
          },
        });
        const items = response?.[keyField] ?? [];
        results.push(...items);
        pageToken = response?.pagination?.next_page_token;
      } while (pageToken);
      return results;
    },
    async paginateSiemQuery({
      $ = this, esql, rangeStart, rangeEnd,
    } = {}) {
      const logs = [];
      let pageToken;
      do {
        const response = await this.executeSiemQuery({
          $,
          data: {
            esql,
            range_start: rangeStart,
            range_end: rangeEnd,
            page_token: pageToken,
          },
        });
        const items = response?.logs ?? [];
        logs.push(...items);
        pageToken = response?.pagination?.next_page_token;
      } while (pageToken);
      return logs;
    },
  },
};
