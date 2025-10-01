import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "posthog",
  propDefinitions: {
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "Identifier of an organization",
      async options() {
        const { organizations } = await this.getUser();
        return organizations?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "Identifier of a project",
      async options({
        organizationId, page,
      }) {
        const limit = constants.DEFAULT_LIMIT;
        const { results } = await this.listProjects({
          organizationId,
          params: {
            limit,
            offset: page * limit,
          },
        });
        return results?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    event: {
      type: "string",
      label: "Event",
      description: "The event type to capture",
      async options({
        projectId, page,
      }) {
        const limit = constants.DEFAULT_LIMIT;
        const { results } = await this.listEvents({
          projectId,
          params: {
            limit,
            offset: page * limit,
          },
        });
        return results?.map(({ name }) => name ) || [];
      },
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      default: 100,
      optional: true,
    },
  },
  methods: {
    _baseUrl(publicUrl = false) {
      const url = this.$auth.instance_url;
      if (publicUrl) {
        return `https://${url.substring(0, 2)}.i.${url.slice(3)}`;
      }
      return `https://${this.$auth.instance_url}`;
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        publicUrl,
        ...otherOpts
      } = opts;

      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl(publicUrl)}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    getUser(opts = {}) {
      return this._makeRequest({
        path: "/api/users/@me",
        ...opts,
      });
    },
    listProjects({
      organizationId, ...opts
    }) {
      return this._makeRequest({
        path: `/api/organizations/${organizationId}/projects`,
        ...opts,
      });
    },
    listEvents({
      projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/api/projects/${projectId}/event_definitions`,
        ...opts,
      });
    },
    listPersons({
      projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/api/projects/${projectId}/persons`,
        ...opts,
      });
    },
    listCohorts({
      projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/api/projects/${projectId}/cohorts`,
        ...opts,
      });
    },
    listSurveys({
      projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/api/projects/${projectId}/surveys`,
        ...opts,
      });
    },
    createQuery({
      projectId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/api/projects/${projectId}/query`,
        publicUrl: true,
        ...opts,
      });
    },
    captureEvent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/capture",
        publicUrl: true,
        ...opts,
      });
    },
    async *paginate({
      fn, args, max,
    }) {
      args = {
        ...args,
        params: {
          ...args?.params,
          limit: constants.DEFAULT_LIMIT,
          offset: 0,
        },
      };
      let hasMore, count = 0;
      do {
        const {
          results, next,
        } = await fn(args);
        for (const result of results) {
          yield result;
          if (max && ++count >= max) {
            return;
          }
        }
        hasMore = next;
        args.params.offset += args.params.limit;
      } while (hasMore);
    },
    async iterateResults(opts = {}) {
      const results = [];
      const items = this.paginate(opts);
      for await (const item of items) {
        results.push(item);
      }
      return results;
    },
  },
};
