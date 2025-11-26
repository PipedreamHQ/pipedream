import { axios } from "@pipedream/platform";
import {
  CHANNEL_OPTIONS,
  CONVERSATION_TYPE_OPTIONS,
  FROM_TYPE_OPTIONS,
  LIMIT,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "belco",
  propDefinitions: {
    shopId: {
      type: "string",
      label: "Shop ID",
      description: "The shop ID to use for the conversation",
      async options() {
        const shops = await this.listShops();
        return shops.map(({
          _id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    from: {
      type: "string",
      label: "From",
      description: "The sender's identifier",
      async options({
        fromType, shopId,
      }) {
        let response, items;
        switch (fromType) {
        case "user":
          items = await this.listUsers();
          break;
        case "team":
          response = await this.listTeams();
          items = response.teams;
          break;
        case "contact":
          response = await this.listContacts({
            shopId,
          });
          items = response.contacts;
          break;
        }
        return items.map(({
          _id, id, profile, pseudonym, name,
        }) => ({
          label: pseudonym || name || `${profile.firstName} ${profile.lastName}`,
          value: id || _id,
        }));
      },
    },
    to: {
      type: "string",
      label: "To",
      description: "The recipient's identifier",
      async options({ shopId }) {
        const { contacts } = await this.listContacts({
          shopId,
        });
        return contacts.map(({
          _id: value, pseudonym: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    conversationId: {
      type: "string",
      label: "Conversation ID",
      description: "Select a conversation to use for the action",
      async options({
        page, includeStatus, excludeStatus,
      }) {
        const { conversations } = await this.listConversations({
          params: {
            limit: LIMIT,
            skip: page * LIMIT,
          },
        });
        return conversations
          .filter((item) => item.channel && (includeStatus
            ? includeStatus.includes(item.status)
            : true) && (excludeStatus
            ? !excludeStatus.includes(item.status)
            : true))
          .map(({
            _id, subject,
          }) => ({
            label: `${_id} - ${subject || "No subject"}`,
            value: _id,
          }));
      },
    },
    channel: {
      type: "string",
      label: "Channel",
      description: "The channel type",
      options: CHANNEL_OPTIONS,
    },
    type: {
      type: "string",
      label: "Type",
      description: "The conversation type",
      options: CONVERSATION_TYPE_OPTIONS,
      optional: true,
    },
    fromType: {
      type: "string",
      label: "From Type",
      description: "The type of the sender",
      options: FROM_TYPE_OPTIONS,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The conversation subject",
      optional: true,
    },
    body: {
      type: "string",
      label: "Body",
      description: "The message body",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.belco.io/v1";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_token}`,
        accept: "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    listShops() {
      return this._makeRequest({
        path: "/shops",
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    listTeams(opts = {}) {
      return this._makeRequest({
        path: "/teams",
        ...opts,
      });
    },
    listContacts({
      shopId, ...opts
    }) {
      return this._makeRequest({
        path: `/shops/${shopId}/contacts`,
        ...opts,
      });
    },
    listConversations(opts = {}) {
      return this._makeRequest({
        path: "/conversations",
        ...opts,
      });
    },
    getConversation({
      conversationId, ...opts
    }) {
      return this._makeRequest({
        path: `/conversations/${conversationId}`,
        ...opts,
      });
    },
    createConversation(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/conversations",
        ...opts,
      });
    },
    sendMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/conversations/sendMessage",
        ...opts,
      });
    },
    closeConversation({
      conversationId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/conversations/${conversationId}/close`,
        ...opts,
      });
    },
    reopenConversation({
      conversationId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/conversations/${conversationId}/open`,
        ...opts,
      });
    },
    replyToConversation({
      conversationId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/conversations/${conversationId}/reply`,
        ...opts,
      });
    },
    addNoteToConversation({
      conversationId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/conversations/${conversationId}/addNote`,
        ...opts,
      });
    },
    addTagsToConversation({
      conversationId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/conversations/${conversationId}/tags`,
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
        params.limit = LIMIT;
        params.skip = page * LIMIT;
        page++;
        const { conversations } = await fn({
          params,
          ...opts,
        });
        for (const conversation of conversations) {
          yield conversation;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = (conversations.length === LIMIT);

      } while (hasMore);
    },
  },
};
