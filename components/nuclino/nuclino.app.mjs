import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 100;

export default {
  type: "app",
  app: "nuclino",
  propDefinitions: {
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "The ID of a workspace",
      async options({ prevContext }) {
        const params = {
          limit: DEFAULT_LIMIT,
        };
        if (prevContext?.after) {
          params.after = prevContext.after;
        }
        const { data: { results } } = await this.listWorkspaces({
          params,
        });
        if (!results?.length) {
          return [];
        }
        return {
          options: results.map((workspace) => ({
            label: workspace.name,
            value: workspace.id,
          })),
          context: {
            after: results[results.length - 1].id,
          },
        };
      },
    },
    itemId: {
      type: "string",
      label: "Item ID",
      description: "The ID of an item",
      async options({
        workspaceId, object, prevContext,
      }) {
        const params = {
          workspaceId,
          limit: DEFAULT_LIMIT,
        };
        if (prevContext?.after) {
          params.after = prevContext.after;
        }
        const { data: { results } } = await this.listItems({
          params,
        });
        const items = object
          ? results?.filter((item) => item.object === object)
          : results;
        if (!items?.length) {
          return [];
        }
        return {
          options: items.map((item) => ({
            label: item.title,
            value: item.id,
          })),
          context: {
            after: items[items.length - 1].id,
          },
        };
      },
    },
    object: {
      type: "string",
      label: "Object",
      description: "The object type. Either `item` or `collection`.",
      async options() {
        return [
          "item",
          "collection",
        ];
      },
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the item or collection",
      optional: true,
    },
    content: {
      type: "string",
      label: "Content",
      description: "Content formatted as Markdown. See [Item Content Format](https://help.nuclino.com/4adea846-item-content-format)",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.nuclino.com/v0";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "authorization": `${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    listWorkspaces(opts = {}) {
      return this._makeRequest({
        path: "/workspaces",
        ...opts,
      });
    },
    listItems(opts = {}) {
      return this._makeRequest({
        path: "/items",
        ...opts,
      });
    },
    createItem(opts = {}) {
      return this._makeRequest({
        path: "/items",
        method: "POST",
        ...opts,
      });
    },
    updateItem({
      itemId, ...opts
    }) {
      return this._makeRequest({
        path: `/items/${itemId}`,
        method: "PUT",
        ...opts,
      });
    },
    async *paginate({
      fn, params, max,
    }) {
      params = {
        ...params,
        limit: DEFAULT_LIMIT,
      };
      let total, count = 0;
      do {
        const { data: { results } } = await fn({
          params,
        });
        for (const result of results) {
          yield result;
          if (max && ++count >= max) {
            return;
          }
        }
        if (!results?.length) {
          return;
        }
        total = results.length;
        params.after = results[results.length - 1].id;
      } while (total === params.limit);
    },
  },
};
