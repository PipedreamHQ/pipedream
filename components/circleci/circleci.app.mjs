import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "circleci",
  version: "0.0.{{ts}}",
  propDefinitions: {
    // Required for creating a new item
    title: {
      type: "string",
      label: "Title",
      description: "The title of the item",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content of the item",
    },
    // Required for updating an existing item
    itemId: {
      type: "string",
      label: "Item ID",
      description: "The unique identifier of the item",
    },
    // Required for adding a comment
    commentContent: {
      type: "string",
      label: "Comment Content",
      description: "The content of the comment",
    },
    // Optional for creating a new item
    metadata: {
      type: "string",
      label: "Metadata",
      description: "Optional metadata as JSON string",
      optional: true,
    },
    // Optional for updating an existing item
    updateFields: {
      type: "string",
      label: "Fields to Update",
      description: "Fields to update in the item as JSON string",
      optional: true,
    },
    // Optional for adding a comment to an existing item
    userDetails: {
      type: "string",
      label: "User Details",
      description: "Optional user details as JSON string",
      optional: true,
    },
    // Optional filters for new item creation events
    newItemType: {
      type: "string",
      label: "Item Type",
      description: "Filter by item type",
      optional: true,
    },
    newItemStatus: {
      type: "string",
      label: "Status",
      description: "Filter by status",
      optional: true,
    },
    // Optional filters for item update events
    updatedItemFields: {
      type: "string",
      label: "Updated Fields",
      description: "Filter by updated fields",
      optional: true,
    },
    updatedItemType: {
      type: "string",
      label: "Item Type",
      description: "Filter by item type",
      optional: true,
    },
    // Optional filters for comment addition events
    commentItemType: {
      type: "string",
      label: "Item Type",
      description: "Filter by item type",
      optional: true,
    },
    commentUser: {
      type: "string",
      label: "User",
      description: "Filter by user",
      optional: true,
    },
  },
  methods: {
    // This method logs the authentication keys
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    // Base URL for CircleCI API
    _baseUrl() {
      return "https://circleci.com/api/v2";
    },
    // Common method to make API requests
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
        ...otherOpts,
      });
    },
    // Create a new item
    async createItem(opts = {}) {
      const {
        title, content, metadata, ...otherOpts
      } = opts;
      const data = {
        title,
        content,
      };
      if (metadata) {
        try {
          data.metadata = JSON.parse(metadata);
        } catch (error) {
          throw new Error("Invalid JSON for metadata");
        }
      }
      return this._makeRequest({
        method: "POST",
        path: "/items",
        data,
        ...otherOpts,
      });
    },
    // Update an existing item
    async updateItem(opts = {}) {
      const {
        itemId, updateFields, ...otherOpts
      } = opts;
      const data = {};
      if (updateFields) {
        try {
          Object.assign(data, JSON.parse(updateFields));
        } catch (error) {
          throw new Error("Invalid JSON for updateFields");
        }
      }
      return this._makeRequest({
        method: "PUT",
        path: `/items/${itemId}`,
        data,
        ...otherOpts,
      });
    },
    // Add a comment to an existing item
    async addComment(opts = {}) {
      const {
        itemId, commentContent, userDetails, ...otherOpts
      } = opts;
      const data = {
        content: commentContent,
      };
      if (userDetails) {
        try {
          data.user = JSON.parse(userDetails);
        } catch (error) {
          throw new Error("Invalid JSON for userDetails");
        }
      }
      return this._makeRequest({
        method: "POST",
        path: `/items/${itemId}/comments`,
        data,
        ...otherOpts,
      });
    },
  },
};
