import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mural",
  propDefinitions: {
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "The ID of the Workspace.",
      async options({ prevContext }) {
        const {
          value, next: nextToken,
        } = await this.listWorkspaces({
          params: {
            next: prevContext?.next,
          },
        });
        return {
          options: value?.map(({
            id: value, name: label,
          }) => ({
            value,
            label,
          })) || [],
          context: {
            next: nextToken,
          },
        };
      },
    },
    muralId: {
      type: "string",
      label: "Mural ID",
      description: "The ID of the Mural.",
      async options({
        workspaceId, prevContext,
      }) {
        const {
          value, next: nextToken,
        } = await this.listMurals({
          workspaceId,
          params: {
            next: prevContext?.next,
          },
        });
        return {
          options: value?.map(({
            id: value, title: label,
          }) => ({
            value,
            label,
          })) || [],
          context: {
            next: nextToken,
          },
        };
      },
    },
    roomId: {
      type: "string",
      label: "Room ID",
      description: "The ID of the Room.",
      async options({
        workspaceId, prevContext,
      }) {
        const {
          value, next: nextToken,
        } = await this.listRooms({
          workspaceId,
          params: {
            next: prevContext?.next,
          },
        });
        return {
          options: value?.map(({
            id: value, name: label,
          }) => ({
            value,
            label,
          })) || [],
          context: {
            next: nextToken,
          },
        };
      },
    },
    tagIds: {
      type: "string[]",
      label: "Tag IDs",
      description: "Unique identifiers of the tags in the widget",
      optional: true,
      async options({
        muralId, prevContext,
      }) {
        const {
          value, next: nextToken,
        } = await this.listTags({
          muralId,
          params: {
            next: prevContext?.next,
          },
        });
        return {
          options: value?.map(({
            id: value, text: label,
          }) => ({
            value,
            label,
          })) || [],
          context: {
            next: nextToken,
          },
        };
      },
    },
    widgetId: {
      type: "string",
      label: "Widget ID",
      description: "Unique identifiers of the widget",
      optional: true,
      async options({
        muralId, type, prevContext,
      }) {
        const {
          value, next: nextToken,
        } = await this.listWidgets({
          muralId,
          params: {
            type,
            next: prevContext?.next,
          },
        });
        return {
          options: value?.map(({
            id: value, title: label,
          }) => ({
            value,
            label,
          })) || [],
          context: {
            next: nextToken,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.mural.co/api/public/v1";
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
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    listWorkspaces(opts = {}) {
      return this._makeRequest({
        path: "/workspaces",
        ...opts,
      });
    },
    listMurals({
      workspaceId, ...opts
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/murals`,
        ...opts,
      });
    },
    listRooms({
      workspaceId, ...opts
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/rooms`,
        ...opts,
      });
    },
    listTags({
      muralId, ...opts
    }) {
      return this._makeRequest({
        path: `/murals/${muralId}/tags`,
        ...opts,
      });
    },
    listWidgets({
      muralId, ...opts
    }) {
      return this._makeRequest({
        path: `/murals/${muralId}/widgets`,
        ...opts,
      });
    },
    createMural(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/murals",
        ...opts,
      });
    },
    createSticky({
      muralId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/murals/${muralId}/widgets/sticky-note`,
        ...opts,
      });
    },
    async *paginate({
      fn,
      args,
      max,
    }) {
      args = {
        ...args,
        params: {
          ...args?.params,
          limit: 100,
        },
      };
      let count = 0;
      do {
        const {
          value, next,
        } = await fn(args);
        for (const item of value) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        args.params.next = next;
      } while (args.params.next);
    },
  },
};
