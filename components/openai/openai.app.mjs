import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "openai",
  propDefinitions: {
    threadId: {
      type: "string",
      label: "Thread ID",
      description: "The ID of the thread",
    },
    messageId: {
      type: "string",
      label: "Message ID",
      description: "The ID of the message to modify",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content of the message",
    },
    role: {
      type: "string",
      label: "Role",
      description: "The role of the entity creating the message",
      options: [
        {
          label: "User",
          value: "user",
        },
      ],
      default: "user",
    },
    fileIds: {
      type: "string[]",
      label: "File IDs",
      description: "List of file IDs to attach to the message",
      optional: true,
    },
    metadata: {
      type: "string",
      label: "Metadata",
      description: "Metadata for the message in JSON string format",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of messages to return",
      optional: true,
    },
    order: {
      type: "string",
      label: "Order",
      description: "Sort order by the created_at timestamp of the messages",
      optional: true,
      options: [
        {
          label: "Ascending",
          value: "asc",
        },
        {
          label: "Descending",
          value: "desc",
        },
      ],
    },
    after: {
      type: "string",
      label: "After",
      description: "A cursor for use in pagination, identifying the message ID to start the list after",
      optional: true,
    },
    before: {
      type: "string",
      label: "Before",
      description: "A cursor for use in pagination, identifying the message ID to end the list before",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.openai.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
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
    async createMessage({
      threadId, content, role, fileIds, metadata,
    }) {
      const parsedMetadata = metadata
        ? JSON.parse(metadata)
        : undefined;
      return this._makeRequest({
        method: "POST",
        path: `/threads/${threadId}/messages`,
        data: {
          role,
          content,
          file_ids: fileIds,
          metadata: parsedMetadata,
        },
      });
    },
    async listMessages({
      threadId, limit, order, after, before,
    }) {
      return this._makeRequest({
        path: `/threads/${threadId}/messages`,
        params: {
          limit,
          order,
          after,
          before,
        },
      });
    },
    async modifyMessage({
      threadId, messageId, metadata,
    }) {
      const parsedMetadata = metadata
        ? JSON.parse(metadata)
        : undefined;
      return this._makeRequest({
        method: "PATCH",
        path: `/threads/${threadId}/messages/${messageId}`,
        data: {
          metadata: parsedMetadata,
        },
      });
    },
  },
};
