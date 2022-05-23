import api from "api";
import constants from "./common/constants.mjs";

const frontapp = api("@front/v1.0.0#dfe7jl3d7mp2h");

export default {
  type: "app",
  app: "frontapp",
  propDefinitions: {
    bodyFormat: {
      type: "string",
      label: "Body Format",
      description: "Format of the message body. Ignored if the message type is not email. Can be one of: 'html', 'markdown'. (Default: 'markdown')",
      optional: true,
      options: [
        "html",
        "markdown",
      ],
    },
    threadRef: {
      type: "string",
      label: "Thread Ref",
      description: "Custom reference which will be used to thread messages. If you omit this field, we'll thread by sender instead.",
      optional: true,
      async options({ prevContext }) {
        return this.paginateOptions({
          prevContext,
          listResourcesFn: this.listConversations,
          mapper: ({
            _links: { self }, subject,
          }) => ({
            label: subject,
            value: self,
          }),
        });
      },
    },
    conversationId: {
      type: "string",
      label: "Conversation ID",
      description: "Conversation unique identifier",
      async options({ prevContext }) {
        return this.paginateOptions({
          prevContext,
          listResourcesFn: this.listConversations,
          mapper: ({
            id, subject,
          }) => ({
            label: subject,
            value: id,
          }),
        });
      },
    },
    attachments: {
      type: "string[]",
      label: "Attachments",
      description: "Binary data of the attached files. Base64 encoded strings are supported. e.g. `data:image/jpeg;name=logo.jpg;base64,/9j/4QAYRXh...`",
      optional: true,
    },
    channelId: {
      type: "string",
      label: "Channel ID",
      description: "Id or address of the channel from which to send the message",
      async options({ prevContext }) {
        return this.paginateOptions({
          prevContext,
          listResourcesFn: this.listChannels,
          mapper: ({
            id, address,
          }) => ({
            label: address,
            value: id,
          }),
        });
      },
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "ID of the contact in Front corresponding to the sender",
      optional: true,
      async options({ prevContext }) {
        return this.paginateOptions({
          prevContext,
          listResourcesFn: this.listContacts,
          mapper: ({
            id, name,
          }) => ({
            label: name,
            value: id,
          }),
        });
      },
    },
    inboxId: {
      type: "string",
      label: "Inbox ID",
      description: "Id of the inbox into which the message should be append.",
      async options({ prevContext }) {
        return this.paginateOptions({
          prevContext,
          listResourcesFn: this.listInboxes,
          mapper: ({
            id, name,
          }) => ({
            label: name,
            value: id,
          }),
        });
      },
    },
    accountId: {
      type: "string",
      label: "Author ID",
      description: "ID of the author of the message",
      optional: true,
      async options({ prevContext }) {
        return this.paginateOptions({
          prevContext,
          listResourcesFn: this.listAccounts,
          mapper: ({
            id, name,
          }) => ({
            label: name,
            value: id,
          }),
        });
      },
    },
    tagIds: {
      type: "string[]",
      label: "Tag IDs",
      description: "List of all the tag IDs.",
      optional: true,
      async options({ prevContext }) {
        return this.paginateOptions({
          prevContext,
          listResourcesFn: this.listTags,
          mapper: ({
            id, name,
          }) => ({
            label: name,
            value: id,
          }),
        });
      },
    },
  },
  methods: {
    async sdk({
      method = constants.METHOD.GET, path, data, params,
    } = {}) {
      const args = [
        path,
        data,
        params,
      ].filter((arg) => arg);

      frontapp.auth(this.$auth.oauth_access_token);
      return frontapp[method](...args);
    },
    async importMessage(args = {}) {
      return this.sdk({
        method: constants.METHOD.IMPORT_INBOX_MESSAGE,
        ...args,
      });
    },
    async sendMessage({
      channelId, ...args
    } = {}) {
      return this.sdk({
        method: constants.METHOD.POST,
        path: `/channels/${channelId}/messages`,
        ...args,
      });
    },
    async updateConversation({
      conversationId, ...args
    } = {}) {
      return this.sdk({
        method: constants.METHOD.PATCH,
        path: `/conversations/${conversationId}`,
        ...args,
      });
    },
    async receiveCustomMessages({
      channelId, ...args
    }) {
      return this.sdk({
        method: constants.METHOD.POST,
        path: `/channels/${channelId}/incoming_messages`,
        ...args,
      });
    },
    async listChannels(args = {}) {
      return this.sdk({
        method: constants.METHOD.GET,
        path: "/channels",
        ...args,
      });
    },
    async listContacts(args = {}) {
      return this.sdk({
        method: constants.METHOD.GET,
        path: "/contacts",
        ...args,
      });
    },
    async listConversations(args = {}) {
      return this.sdk({
        method: constants.METHOD.LIST_CONVERSATIONS,
        ...args,
      });
    },
    async listInboxes(args = {}) {
      return this.sdk({
        method: constants.METHOD.GET,
        path: "/inboxes",
        ...args,
      });
    },
    async listAccounts(args = {}) {
      return this.sdk({
        method: constants.METHOD.GET,
        path: "/accounts",
        ...args,
      });
    },
    async listTags(args = {}) {
      return this.sdk({
        method: constants.METHOD.GET,
        path: "/tags",
        ...args,
      });
    },
    async paginateOptions({
      prevContext, listResourcesFn, mapper,
    }) {
      const { pageToken } = prevContext;

      if (pageToken === false) {
        return [];
      }

      const {
        _pagination: { next: nextPageToken },
        _results: resources,
      } = await listResourcesFn({
        params: {
          page_token: pageToken,
        },
      });

      return {
        options: resources.map(mapper),
        context: {
          pageToken: nextPageToken || false,
        },
      };
    },
  },
};
