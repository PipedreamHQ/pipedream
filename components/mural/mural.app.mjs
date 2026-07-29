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
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      default: 100,
      min: 1,
      optional: true,
    },
    widgetId: {
      type: "string",
      label: "Widget ID",
      description: "The `id` of a widget, as returned by the **List Widgets** action.",
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
    /**
     * PUT to a presigned asset storage URL (returned by createAssetUrl).
     * Cannot use _makeRequest: that helper always targets the Mural API base URL
     * and injects a Bearer token. Storage uploads use an absolute third-party URL
     * and the headers provided in the asset response (e.g. x-ms-blob-type).
     */
    _uploadRequest(opts = {}) {
      const {
        $ = this,
        url,
        headers,
        data,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url,
        headers,
        data,
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
    searchMurals({
      workspaceId, ...opts
    }) {
      return this._makeRequest({
        path: `/search/${workspaceId}/murals`,
        ...opts,
      });
    },
    createTextbox({
      muralId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/murals/${muralId}/widgets/textbox`,
        ...opts,
      });
    },
    createShape({
      muralId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/murals/${muralId}/widgets/shape`,
        ...opts,
      });
    },
    createAssetUrl({
      muralId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/murals/${muralId}/assets`,
        ...opts,
      });
    },
    uploadAsset(opts = {}) {
      return this._uploadRequest({
        ...opts,
        method: "PUT",
      });
    },
    createImage({
      muralId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/murals/${muralId}/widgets/image`,
        ...opts,
      });
    },
    updateSticky({
      muralId, widgetId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/murals/${muralId}/widgets/sticky-note/${widgetId}`,
        ...opts,
      });
    },
    createRoom(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/rooms",
        ...opts,
      });
    },
    inviteToMural({
      muralId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/murals/${muralId}/users/invite`,
        ...opts,
      });
    },
    async getPaginatedResults(opts) {
      const results = [];
      for await (const item of this.paginate(opts)) {
        results.push(item);
      }
      return results;
    },
    async *paginate({
      fn,
      args,
      max,
      limit = 100,
    }) {
      args = {
        ...args,
        params: {
          ...args?.params,
          ...(limit && {
            limit,
          }),
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
