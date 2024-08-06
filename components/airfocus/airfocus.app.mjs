import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "airfocus",
  propDefinitions: {
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "The ID of the workspace",
    },
    itemId: {
      type: "string",
      label: "Item ID",
      description: "The ID of the item",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the item",
    },
    itemType: {
      type: "string",
      label: "Item Type",
      description: "The type of the item",
    },
    statusId: {
      type: "string",
      label: "Status ID",
      description: "The ID of the status",
    },
    order: {
      type: "integer",
      label: "Order",
      description: "The order of the item",
    },
    fields: {
      type: "object",
      label: "Fields",
      description: "The fields of the item",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the item",
    },
    color: {
      type: "string",
      label: "Color",
      description: "The color of the item",
    },
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Whether the item is archived",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.airfocus.com/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async emitNewItemCreatedEvent(workspaceId) {
      return this._makeRequest({
        method: "POST",
        path: `/workspaces/${workspaceId}/items/search`,
        data: {
          sort: "createdat",
        },
      });
    },
    async emitItemUpdatedEvent(workspaceId) {
      return this._makeRequest({
        method: "POST",
        path: `/workspaces/${workspaceId}/items/search`,
        data: {
          sort: "lastupdatedat",
        },
      });
    },
    async emitNewItemOrUpdateEvent(workspaceId) {
      return this._makeRequest({
        method: "POST",
        path: `/workspaces/${workspaceId}/items/search`,
      });
    },
    async deleteItem(workspaceId, itemId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/workspaces/${workspaceId}/items/${itemId}`,
      });
    },
    async createItem({
      workspaceId, statusId, order, name, fields, description, color, archived,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/workspaces/${workspaceId}/items`,
        data: {
          statusId,
          order,
          name,
          fields,
          description,
          color,
          archived,
        },
      });
    },
    async updateItem({
      workspaceId, itemId, ...otherFields
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/workspaces/${workspaceId}/items/${itemId}`,
        data: {
          ...otherFields,
        },
      });
    },
  },
};
