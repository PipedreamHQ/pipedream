import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "launchdarkly",
  propDefinitions: {
    project: {
      type: "string",
      label: "Project Key",
      description: "The project key.",
      async options({
        mapper = ({
          key: value, name: label,
        }) => ({
          label,
          value,
        }),
      }) {
        const { items } = await this.listProjects();
        return items.map(mapper);
      },
    },
    environment: {
      type: "string",
      label: "Environment Key",
      description: "The environment key.",
      async options({
        projectKey, mapper = ({
          key: value, name: label,
        }) => ({
          label,
          value,
        }),
      }) {
        if (!projectKey) {
          return [];
        }
        const { items } = await this.listEnvironments({
          projectKey,
        });
        return items.map(mapper);
      },
    },
    flag: {
      type: "string",
      label: "Feature Flag Key",
      description: "The key of the feature flag to evaluate or update.",
      async options({
        projectKey, environmentKey: env,
        mapper = ({
          key: value, name: label,
        }) => ({
          label,
          value,
        }),
      }) {
        if (!projectKey) {
          return [];
        }
        const { items } = await this.listFeatureFlags({
          projectKey,
          params: {
            env,
          },
        });
        return items.map(mapper);
      },
    },
    contextKind: {
      type: "string",
      label: "Context Kind",
      description: "The kind of context to evaluate the flag.",
      async options({
        projectKey,
        mapper = ({
          key: value, name: label,
        }) => ({
          label,
          value,
        }),
      }) {
        if (!projectKey) {
          return [];
        }
        const { items } = await this.getContextKinds({
          projectKey,
        });
        return items.map(mapper);
      },
    },
    context: {
      type: "string",
      label: "Context",
      description: "Contextual information for evaluating the flag.",
      async options({
        projectKey, environmentKey,
        mapper = ({
          key: value, name: label,
        }) => ({
          label,
          value,
        }),
      }) {
        if (!projectKey || !environmentKey) {
          return [];
        }
        const { items } = await this.searchContexts({
          projectKey,
          environmentKey,
        });
        return items.map(mapper);
      },
    },
    memberId: {
      type: "string",
      label: "Member ID",
      description: "The member ID.",
      async options({
        mapper = ({
          _id: value, email: label,
        }) => ({
          label,
          value,
        }),
      }) {
        const { items } = await this.listAccountMembers();
        return items.map(mapper);
      },
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      optional: true,
      default: 100,
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        ...headers,
        "Authorization": this.$auth.access_token,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
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
    listProjects(args = {}) {
      return this._makeRequest({
        path: "/projects",
        ...args,
      });
    },
    listEnvironments({
      projectKey, ...args
    } = {}) {
      return this._makeRequest({
        path: `/projects/${projectKey}/environments`,
        ...args,
      });
    },
    listFeatureFlags({
      projectKey, ...args
    } = {}) {
      return this._makeRequest({
        path: `/flags/${projectKey}`,
        ...args,
      });
    },
    getContextKinds({
      projectKey, ...args
    } = {}) {
      return this._makeRequest({
        path: `/projects/${projectKey}/context-kinds`,
        ...args,
      });
    },
    searchContexts({
      projectKey, environmentKey, ...args
    } = {}) {
      return this.post({
        path: `/projects/${projectKey}/environments/${environmentKey}/contexts/search`,
        ...args,
      });
    },
    updateFeatureFlag({
      projectKey, featureFlagKey, ...args
    } = {}) {
      return this.patch({
        path: `/flags/${projectKey}/${featureFlagKey}`,
        ...args,
      });
    },
    getFeatureFlag({
      projectKey, featureFlagKey, ...args
    } = {}) {
      return this._makeRequest({
        path: `/flags/${projectKey}/${featureFlagKey}`,
        ...args,
      });
    },
    listAccountMembers(args = {}) {
      return this._makeRequest({
        path: "/members",
        ...args,
      });
    },
    getFeatureFlagStatus({
      projectKey, environmentKey, featureFlagKey, ...args
    } = {}) {
      return this._makeRequest({
        path: `/flag-statuses/${projectKey}/${environmentKey}/${featureFlagKey}`,
        ...args,
      });
    },
    getProject({
      projectKey, ...args
    } = {}) {
      return this._makeRequest({
        path: `/projects/${projectKey}`,
        ...args,
      });
    },
    async *paginate({
      fn, args = {}, max,
    }) {
      args = {
        ...args,
        params: {
          ...args?.params,
          limit: 100,
          offset: 0,
        },
      };
      let totalItems, count = 0;
      do {
        const {
          items, totalCount,
        } = await fn(args);
        for (const item of items) {
          yield item;
          count++;
          if (max && count >= max) {
            return;
          }
        }
        totalItems = totalCount;
        args.params.offset += args.params.limit;
      } while (count < totalItems);
    },
  },
};
