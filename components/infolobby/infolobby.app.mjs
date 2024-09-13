import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "infolobby",
  propDefinitions: {
    itemId: {
      type: "string",
      label: "Item ID",
      description: "ID of the Item",
      async options({ tableId }) {
        const itemIds = await this.listItems({
          tableId,
        });
        return itemIds.map(({ item_id }) => ({
          value: item_id,
        }));
      },
    },
    tableId: {
      type: "string",
      label: "Table ID",
      description: "ID of the Table. You can get it from the developer tab in the table settings at InfoLobby",
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "Comment to register in selected the item",
    },
  },
  methods: {
    _baseUrl() {
      return "https://infolobby.com/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createComment({
      tableId, itemId, ...args
    }) {
      return this._makeRequest({
        method: "post",
        path: `/table/${tableId}/record/${itemId}/comments/create`,
        ...args,
      });
    },
    async listItems({
      tableId, ...args
    }) {
      return this._makeRequest({
        path: `/table/${tableId}/records/query`,
        ...args,
      });
    },
  },
};
