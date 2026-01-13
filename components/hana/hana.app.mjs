import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "hana",
  propDefinitions: {
    reportGroupId: {
      type: "string",
      label: "Report Group ID",
      description: "ID of the report group. Select or search for a report group.",
      useQuery: true,
      async options({
        query, page,
      }) {
        const { content: { data } } = await this.searchReportGroups({
          params: {
            search: query,
            page: page + 1,
          },
        });
        return data?.map(({
          _id: value, title: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    reportGroupName: {
      type: "string",
      label: "Report Group Name",
      description: "Name of the report group. Select or search for a report group.",
      useQuery: true,
      async options({
        query, page,
      }) {
        const { content: { data } } = await this.searchReportGroups({
          params: {
            search: query,
            page: page + 1,
          },
        });
        return data?.map(({ title }) => title) || [];
      },
    },
    reportGroupMessageId: {
      type: "string",
      label: "Message ID",
      description: "ID of the message. Select or search for a message.",
      useQuery: true,
      async options({
        reportGroupId, query, page,
      }) {
        const { content: { data } } = await this.searchReportGroupMessages({
          reportGroupId,
          params: {
            search: query,
            page: page + 1,
          },
        });
        return data?.map(({
          _id: value, description: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    spaceName: {
      type: "string",
      label: "Space Name",
      description: "Name of the space. Select or search for a space.",
      useQuery: true,
      async options({
        query, page,
      }) {
        const { content: { data } } = await this.searchSpaces({
          params: {
            search: query,
            page: page + 1,
          },
        });
        return data?.map(({
          spaceId: value, displayName: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    role: {
      type: "string",
      label: "Role",
      description: "Role of the message. Either `user` or `assistant`.",
      options: [
        "user",
        "assistant",
      ],
    },
    search: {
      type: "string",
      label: "Search",
      description: "Filters the result for a particular search string",
      optional: true,
    },
    perPage: {
      type: "integer",
      label: "Per Page",
      description: "The number of records to fetch per page",
      default: 10,
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page number starting from 1",
      default: 1,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://hana-api.hanabitech.com/v1/expose-api";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        ...opts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "x-api-key": this.$auth.api_key,
        },
      });
    },
    searchReportGroups(opts = {}) {
      return this._makeRequest({
        path: "/report-groups",
        ...opts,
      });
    },
    generateCompletion(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/chat/completion",
        ...opts,
      });
    },
    getChatCompletionStatus(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/chat/statuses",
        ...opts,
      });
    },
    createGoogleChatMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/chat/create-google-chat-message",
        ...opts,
      });
    },
    searchReportGroupMessages({
      reportGroupId, ...opts
    }) {
      return this._makeRequest({
        path: `/report-groups/${reportGroupId}/report-messages`,
        ...opts,
      });
    },
    searchSpaces(opts = {}) {
      return this._makeRequest({
        path: "/spaces",
        ...opts,
      });
    },
    createReportGroupMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/report-groups/report-messages",
        ...opts,
      });
    },
    async *paginate({
      fn, args = {}, max,
    }) {
      args = {
        ...args,
        params: {
          ...args?.params,
          page: 1,
          per_page: 100,
        },
      };
      let count = 0, hasMore = true;
      do {
        const {
          content: {
            data, totalCount,
          },
        } = await fn(args);
        if (!data?.length) {
          return;
        }
        for (const d of data) {
          yield d;
          count++;
          if (max && count === max) {
            return;
          }
        }
        hasMore = count < totalCount;
        args.params.page++;
      } while (hasMore);
    },
    async getPaginatedResults(opts = {}) {
      const results = [];
      for await (const result of this.paginate(opts)) {
        results.push(result);
      }
      return results;
    },
  },
};
