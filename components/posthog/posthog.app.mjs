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
  },
  methods: {
    _baseUrl() {
      return "https://app.posthog.com";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
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
    createQuery({
      projectId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/api/projects/${projectId}/query`,
        ...opts,
      });
    },
    captureEvent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/capture",
        ...opts,
      });
    },
  },
};
