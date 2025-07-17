import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "chattermill",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of a project",
      async options() {
        const { projects } = await this.listProjects();
        return projects.map((project) => ({
          label: project.name,
          value: project.id,
        }));
      },
    },
    responseId: {
      type: "string",
      label: "Response ID",
      description: "The ID of a response",
      async options({
        projectId, page,
      }) {
        const { responses } = await this.listResponses({
          projectId,
          params: {
            page: page + 1,
          },
        });
        return responses?.map((response) => ({
          label: response.comment || response.id,
          value: response.id,
        })) || [];
      },
    },
    dataType: {
      type: "string",
      label: "Data Type",
      description: "The type of data to add to the response. Note: Not all combinations of data type and data source are valid.",
      default: "Comment",
      async options({ projectId }) {
        const { data_types: types } = await this.listDataTypes({
          projectId,
        });
        return types.map((type) => type.name);
      },
    },
    dataSource: {
      type: "string",
      label: "Data Source",
      description: "The source of the data to add to the response. Note: Not all combinations of data type and data source are valid.",
      default: "CSV Upload",
      async options({ projectId }) {
        const { data_sources: sources } = await this.listDataSources({
          projectId,
        });
        return sources.map((source) => source.name);
      },
    },
    userMeta: {
      type: "object",
      label: "User Meta",
      description: "The user meta to add to the response. Example: `{ \"customer_id\": { \"type\": \"text\", \"value\": \"1234\", \"name\": \"Customer ID\" } }`",
    },
    segments: {
      type: "object",
      label: "Segments",
      description: "The segments to add to the response. Example: `{ \"customer_type\": { \"type\": \"text\", \"value\": \"New\", \"name\": \"Customer Type\" } }`",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.chattermill.com/v1";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    getResponse({
      projectId, responseId, ...opts
    }) {
      return this._makeRequest({
        path: `/${projectId}/responses/${responseId}`,
        ...opts,
      });
    },
    listProjects(opts = {}) {
      return this._makeRequest({
        path: "/projects",
        ...opts,
      });
    },
    listResponses({
      projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/${projectId}/responses`,
        ...opts,
      });
    },
    listDataTypes({
      projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/${projectId}/data_types`,
        ...opts,
      });
    },
    listDataSources({
      projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/${projectId}/data_sources`,
        ...opts,
      });
    },
    createResponse({
      projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/${projectId}/responses`,
        method: "POST",
        ...opts,
      });
    },
    updateResponse({
      projectId, responseId, ...opts
    }) {
      return this._makeRequest({
        path: `/${projectId}/responses/${responseId}`,
        method: "PUT",
        ...opts,
      });
    },
    async *paginate({
      fn, args, resourceKey, max,
    }) {
      const limit = 100;
      args = {
        ...args,
        params: {
          ...args.params,
          per_page: limit,
          page: 1,
        },
      };
      let total, count = 0;
      do {
        const response = await fn(args);
        const items = response[resourceKey];
        if (!items?.length) {
          return;
        }
        for (const item of items) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        total = items.length;
        args.params.page++;
      } while (total === limit);
    },
    async getPaginatedResources(opts) {
      const resources = [];
      for await (const resource of this.paginate(opts)) {
        resources.push(resource);
      }
      return resources;
    },
  },
};
