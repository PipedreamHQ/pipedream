import { axios } from "@pipedream/platform";
import {
  BASE_URL,
  DEFAULT_MAX_RESULTS,
  MAX_PAGE_SIZE,
  PAGE_SIZE,
} from "./common/constants.mjs";
import { tagLabel } from "./common/utils.mjs";

export default {
  type: "app",
  app: "tinko",
  propDefinitions: {
    channelId: {
      type: "string",
      label: "Channel",
      description: "The ID of a Tinko channel (a connected WhatsApp number, Instagram account or site chat), e.g. `01JABCDEFGHJKMNPQRSTVWXYZ0`. Use **List Channels** to find channel IDs (the `id` field).",
      async options({ page }) {
        const { data } = await this.listChannels({
          params: {
            page: page + 1,
            per_page: PAGE_SIZE,
          },
        });
        return data.map((channel) => ({
          label: channel.type
            ? `${channel.name} (${channel.type})`
            : channel.name,
          value: channel.id,
        }));
      },
    },
    channelIds: {
      type: "string[]",
      label: "Channels",
      description: "Only listen to events of these channels, e.g. `[\"01JABCDEFGHJKMNPQRSTVWXYZ0\"]`. Leave empty to listen to all channels. Use **List Channels** to find channel IDs (the `id` field).",
      optional: true,
      async options({ page }) {
        const { data } = await this.listChannels({
          params: {
            page: page + 1,
            per_page: PAGE_SIZE,
          },
        });
        return data.map((channel) => ({
          label: channel.type
            ? `${channel.name} (${channel.type})`
            : channel.name,
          value: channel.id,
        }));
      },
    },
    contactId: {
      type: "string",
      label: "Contact",
      description: "The ID of the contact, e.g. `01JABCDEFGHJKMNPQRSTVWXYZ0`. Use **Find Contact** to find it by name or phone number (the `id` field).",
      useQuery: true,
      async options({
        page, query,
      }) {
        const { data } = await this.listContacts({
          params: {
            page: page + 1,
            per_page: PAGE_SIZE,
            name: query || undefined,
          },
        });
        return data.map((contact) => ({
          label: contact.name
            ? `${contact.name} (${contact.phone})`
            : contact.phone,
          value: contact.id,
        }));
      },
    },
    chatId: {
      type: "string",
      label: "Chat",
      description: "The ID of the chat, e.g. `01JABCDEFGHJKMNPQRSTVWXYZ0`. Use **List Chats** to find it (the `id` field). The chat ID is also part of every event emitted by the Tinko sources (`chat.id`).",
      async options({ page }) {
        const { data } = await this.listChats({
          params: {
            page: page + 1,
            per_page: PAGE_SIZE,
          },
        });
        return data.map((chat) => ({
          label: `${chat.contact?.name || chat.contact?.phone || chat.id} (${chat.status})`,
          value: chat.id,
        }));
      },
    },
    tagId: {
      type: "string",
      label: "Tag",
      description: "The ID of a tag, e.g. `01JABCDEFGHJKMNPQRSTVWXYZ0`. Use **List Tags** to find tag IDs (the `id` field).",
      async options({ page }) {
        const { data } = await this.listTags({
          params: {
            page: page + 1,
            per_page: PAGE_SIZE,
          },
        });
        return data.map((tag) => ({
          label: tagLabel(tag),
          value: tag.id,
        }));
      },
    },
    tagIds: {
      type: "string[]",
      label: "Tags",
      description: "The IDs of the tags, e.g. `[\"01JABCDEFGHJKMNPQRSTVWXYZ0\"]`. Use **List Tags** to find tag IDs (the `id` field), or **Create Tag** to add a new one.",
      async options({ page }) {
        const { data } = await this.listTags({
          params: {
            page: page + 1,
            per_page: PAGE_SIZE,
          },
        });
        return data.map((tag) => ({
          label: tagLabel(tag),
          value: tag.id,
        }));
      },
    },
    userId: {
      type: "string",
      label: "Attendant",
      description: "The ID of a Tinko user (attendant), e.g. `01JABCDEFGHJKMNPQRSTVWXYZ0`. Use **List Users** to find user IDs (the `id` field).",
      async options({ page }) {
        const { data } = await this.listUsers({
          params: {
            page: page + 1,
            per_page: PAGE_SIZE,
          },
        });
        return data.map((user) => ({
          label: user.email
            ? `${user.name} (${user.email})`
            : user.name,
          value: user.id,
        }));
      },
    },
    templateId: {
      type: "string",
      label: "Template",
      description: "The ID of an approved WhatsApp template, e.g. `01JABCDEFGHJKMNPQRSTVWXYZ0`. Templates work only on official WhatsApp channels. Use **List Templates** to find template IDs (the `id` field).",
      async options({
        page, channelId,
      }) {
        const { data } = await this.listTemplates({
          params: {
            page: page + 1,
            per_page: PAGE_SIZE,
            status: "approved",
            channel: channelId || undefined,
          },
        });
        return data.map((template) => ({
          label: template.language
            ? `${template.name} (${template.language})`
            : template.name,
          value: template.id,
        }));
      },
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: `Maximum number of results to return, e.g. \`50\`. Defaults to \`${DEFAULT_MAX_RESULTS}\`.`,
      min: 1,
      default: DEFAULT_MAX_RESULTS,
      optional: true,
    },
  },
  methods: {
    _makeRequest({
      $ = this, headers, ...args
    } = {}) {
      return axios($, {
        baseURL: BASE_URL,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Accept": "application/json",
          ...headers,
        },
        ...args,
      });
    },
    listChannels(args = {}) {
      return this._makeRequest({
        url: "/channels",
        ...args,
      });
    },
    listContacts(args = {}) {
      return this._makeRequest({
        url: "/contacts",
        ...args,
      });
    },
    listCustomFields(args = {}) {
      return this._makeRequest({
        url: "/contacts/customfields",
        ...args,
      });
    },
    getContact({
      contactId, ...args
    }) {
      return this._makeRequest({
        url: `/contacts/${encodeURIComponent(contactId)}`,
        ...args,
      });
    },
    createContact(args = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/contacts",
        ...args,
      });
    },
    updateContact({
      contactId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `/contacts/${encodeURIComponent(contactId)}`,
        ...args,
      });
    },
    createContactNote({
      contactId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/contacts/${encodeURIComponent(contactId)}/notes`,
        ...args,
      });
    },
    sendMessage(args = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/messages",
        ...args,
      });
    },
    listChats(args = {}) {
      return this._makeRequest({
        url: "/chats",
        ...args,
      });
    },
    transferChat({
      chatId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/chats/${encodeURIComponent(chatId)}/transfer`,
        ...args,
      });
    },
    closeChat({
      chatId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/chats/${encodeURIComponent(chatId)}/close`,
        ...args,
      });
    },
    listTags(args = {}) {
      return this._makeRequest({
        url: "/tags",
        ...args,
      });
    },
    createTag(args = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/tags",
        ...args,
      });
    },
    listTemplates(args = {}) {
      return this._makeRequest({
        url: "/templates",
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        url: "/users",
        ...args,
      });
    },
    createWebhook(args = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/webhooks",
        ...args,
      });
    },
    deleteWebhook({
      webhookId, ...args
    }) {
      return this._makeRequest({
        method: "DELETE",
        url: `/webhooks/${encodeURIComponent(webhookId)}`,
        ...args,
      });
    },
    /**
     * Iterates over every item of a paginated Tinko list endpoint.
     * @param {object} opts
     * @param {Function} opts.fn - App method that lists one page, e.g. `this.listTags`
     * @param {object} [opts.args={}] - Arguments passed to `fn` (`$`, `params`)
     * @param {number} [opts.max] - Stop after this many items
     * @returns {AsyncGenerator<object>} The items, one by one
     */
    async *paginate({
      fn, args = {}, max,
    }) {
      let page = 1;
      let count = 0;
      while (true) {
        const {
          data = [], pagination,
        } = await fn.call(this, {
          ...args,
          params: {
            ...args.params,
            page,
            per_page: MAX_PAGE_SIZE,
          },
        });
        for (const item of data) {
          yield item;
          count++;
          if (max && count >= max) {
            return;
          }
        }
        if (!data.length || !pagination || pagination.current_page >= pagination.last_page) {
          return;
        }
        page++;
      }
    },
    /**
     * Collects the items of a paginated Tinko list endpoint into an array.
     * @param {object} opts - Same options as `paginate`
     * @returns {Promise<object[]>} The items
     */
    async getPaginatedResults(opts) {
      const results = [];
      for await (const item of this.paginate(opts)) {
        results.push(item);
      }
      return results;
    },
  },
};
