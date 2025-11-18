import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "customgpt",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project (agent)",
      async options({ page }) {
        const { data: { data } } = await this.listProjects({
          params: {
            page: page + 1,
          },
        });
        return data.map(({
          id: value, project_name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    conversationId: {
      type: "string",
      label: "Conversation ID",
      description: "The ID of the conversation",
      async options({
        projectId, fieldId = "id", page,
      }) {
        const { data: { data } } = await this.listConversations({
          projectId,
          params: {
            page: page + 1,
          },
        });
        return data.map(({
          [fieldId]: value, name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.customgpt.ai/api/v1";
    },
    _getHeaders(headers = {}) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_key}`,
        ...headers,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      headers,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._getHeaders(headers),
        ...opts,
      });
    },
    listProjects(opts = {}) {
      return this._makeRequest({
        path: "/projects",
        method: "GET",
        ...opts,
      });
    },
    createProject(opts = {}) {
      return this._makeRequest({
        path: "/projects",
        method: "POST",
        ...opts,
      });
    },
    listConversations({
      projectId, ...opts
    } = {}) {
      return this._makeRequest({
        path: `/projects/${projectId}/conversations`,
        ...opts,
      });
    },
    createConversation({
      projectId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/projects/${projectId}/conversations`,
        ...opts,
      });
    },
    listMessages({
      conversationId, projectId, ...opts
    } = {}) {
      return this._makeRequest({
        path: `/projects/${projectId}/conversations/${conversationId}/messages`,
        method: "GET",
        ...opts,
      });
    },
    sendMessage({
      conversationId, projectId, ...opts
    } = {}) {
      return this._makeRequest({
        path: `/projects/${projectId}/conversations/${conversationId}/messages`,
        method: "POST",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, fieldData, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        let {
          data, next_page_url: nextPageUrl,
        } = await fn({
          params,
          ...opts,
        });

        data = fieldData
          ? data[fieldData].data
          : data.data;

        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = nextPageUrl;

      } while (hasMore);
    },
  },
};
