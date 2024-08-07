import { axios } from "@pipedream/platform";
import {
  COLOR_OPTIONS, LIMIT,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "airfocus",
  propDefinitions: {
    itemId: {
      type: "string",
      label: "Item ID",
      description: "The ID of the item.",
      async options({ page }) {
        const { items } = await this.listItems({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });

        return items.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the item.",
    },
    statusId: {
      type: "string",
      label: "Status ID",
      description: "The ID of the status.",
      async options() {
        const { _embedded: { statuses } } = await this.getWorkspace();

        return Object.entries(statuses).map(([
          , {
            id: value, name: label,
          },
        ]) => ({
          label,
          value,
        }));
      },
    },
    fields: {
      type: "object",
      label: "Fields",
      description: "Values of custom fields, where each key is a custom-field ID and each value is a JSON-formatted value of the corresponding field.",
    },
    description: {
      type: "object",
      label: "Description",
      description: "An object with content description blocks [See the documentation](https://developer.airfocus.com/endpoints.html).",
    },
    color: {
      type: "string",
      label: "Color",
      description: "The color of the item.",
      options: COLOR_OPTIONS,
    },
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Whether the item is archived.",
    },
  },
  methods: {
    _baseUrl() {
      return `https://api.airfocus.com/api/workspaces/${this.getWorkspaceId()}`;
    },
    getWorkspaceId() {
      return `${this.$auth.workspace_id}`;
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path = "", ...opts
    } = {}) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    getWorkspace() {
      return this._makeRequest();
    },
    getItem({ itemId }) {
      return this._makeRequest({
        path: `/items/${itemId}`,
      });
    },
    listItems(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/items/search",
        ...opts,
      });
    },
    deleteItem({
      itemId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/items/${itemId}`,
        ...opts,
      });
    },
    createItem(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/items",
        ...opts,
      });
    },
    updateItem({
      itemId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/items/${itemId}`,
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.offset = LIMIT * page;
        params.limit = LIMIT;
        page++;

        const { items } = await fn({
          params,
          ...opts,
        });
        for (const d of items) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = items.length;

      } while (hasMore);
    },
  },
};
