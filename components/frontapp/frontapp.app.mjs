import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "frontapp",
  propDefinitions: {
    bodyFormat: {
      type: "string",
      label: "Body Format",
      description: "Format of the message body. Ignored if the message type is not email. Can be one of: 'html', 'markdown'. (Default: 'markdown')",
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
      description: "File paths of files previously downloaded in Pipedream E.g. (`/tmp/my-image.jpg`). [Download a file to the `/tmp` directory](https://pipedream.com/docs/code/nodejs/http-requests/#download-a-file-to-the-tmp-directory)",
      optional: true,
    },
    channelId: {
      type: "string",
      label: "Channel ID",
      description: "Id or address of the channel from which to send the message",
      async options({
        prevContext, filter,
      }) {
        return this.paginateOptions({
          prevContext,
          listResourcesFn: this.listChannels,
          filter,
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
      async options({
        prevContext, appendNull,
      }) {
        return this.paginateOptions({
          prevContext,
          listResourcesFn: this.listContacts,
          mapper: ({
            id, name,
          }) => ({
            label: name,
            value: id,
          }),
          appendNull,
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
    teammateId: {
      type: "string",
      label: "Teammate ID",
      description: "ID of the contact in Front corresponding to the sender",
      async options({ prevContext }) {
        return this.paginateOptions({
          prevContext,
          listResourcesFn: this.listTeammates,
          mapper: ({
            id, email,
          }) => ({
            label: email,
            value: id,
          }),
        });
      },
    },
    to: {
      type: "string[]",
      label: "To",
      description: "List of recipient handles who received the message.",
    },
    cc: {
      type: "string[]",
      label: "CC",
      description: "List of recipient handles who received a copy of the message.",
      optional: true,
    },
    bcc: {
      type: "string[]",
      label: "BCC",
      description: "List of the recipeient handles who received a blind copy of the message.",
      optional: true,
    },
  },
  methods: {
    getUrl(path, url) {
      return url || `${constants.BASE_URL}${path}`;
    },
    hasMultipartHeader(headers) {
      return headers && headers["Content-Type"].includes("multipart/form-data");
    },
    getHeaders(headers) {
      return {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        ...headers,
      };
    },
    getConfig({
      headers, path, url, data: oriignalData, ...args
    } = {}) {
      const hasMultipartHeader = this.hasMultipartHeader(headers);
      const data = hasMultipartHeader && utils.getFormData(oriignalData) || oriignalData;
      const currentHeaders = this.getHeaders(headers);
      const builtHeaders = hasMultipartHeader
        ? {
          ...currentHeaders,
          "Content-Type": data.getHeaders()["content-type"],
        }
        : currentHeaders;
      return {
        headers: builtHeaders,
        url: this.getUrl(path, url),
        data,
        ...args,
      };
    },
    async makeRequest({
      $ = this, ...args
    } = {}) {
      const config = this.getConfig(args);
      try {
        return await axios($, config);
      } catch (error) {
        console.log("error", error.response?.data);
        throw error;
      }
    },
    async importMessage({
      inboxId, ...args
    } = {}) {
      return this.makeRequest({
        method: constants.METHOD.POST,
        path: `/inboxes/${inboxId}/imported_messages`,
        ...args,
      });
    },
    async sendMessage({
      channelId, ...args
    } = {}) {
      return this.makeRequest({
        method: constants.METHOD.POST,
        path: `/channels/${channelId}/messages`,
        ...args,
      });
    },
    async replyToConversation({
      conversationId, ...args
    } = {}) {
      return this.makeRequest({
        method: constants.METHOD.POST,
        path: `/conversations/${conversationId}/messages`,
        ...args,
      });
    },
    async updateConversation({
      conversationId, ...args
    } = {}) {
      return this.makeRequest({
        method: constants.METHOD.PATCH,
        path: `/conversations/${conversationId}`,
        ...args,
      });
    },
    async receiveCustomMessages({
      channelId, ...args
    }) {
      return this.makeRequest({
        method: constants.METHOD.POST,
        path: `/channels/${channelId}/incoming_messages`,
        ...args,
      });
    },
    async listChannels(args = {}) {
      return this.makeRequest({
        path: "/channels",
        ...args,
      });
    },
    async listContacts(args = {}) {
      return this.makeRequest({
        path: "/contacts",
        ...args,
      });
    },
    async listConversations(args = {}) {
      return this.makeRequest({
        path: "/conversations",
        ...args,
      });
    },
    async listEvents(args = {}) {
      return this.makeRequest({
        path: "/events",
        ...args,
      });
    },
    async listInboxes(args = {}) {
      return this.makeRequest({
        path: "/inboxes",
        ...args,
      });
    },
    async listAccounts(args = {}) {
      return this.makeRequest({
        path: "/accounts",
        ...args,
      });
    },
    async listTags(args = {}) {
      return this.makeRequest({
        path: "/tags",
        ...args,
      });
    },
    async listTeammates(args = {}) {
      return this.makeRequest({
        path: "/teammates",
        ...args,
      });
    },
    async searchConversation({
      query, ...args
    }) {
      return this.makeRequest({
        path: `/conversations/search/${query}`,
        ...args,
      });
    },
    async paginateOptions({
      prevContext,
      listResourcesFn,
      filter = () => true,
      mapper = (resource) => resource,
      appendNull = false,
    } = {}) {
      const { pageToken } = prevContext;

      if (pageToken === false) {
        return appendNull
          ? [
            {
              label: "Null",
              value: "null",
            },
          ]
          : [];
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
        options: resources.filter(filter).map(mapper),
        context: {
          pageToken: nextPageToken || false,
        },
      };
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...args
    }) {
      let hasMore = false;
      let count = 0;
      let pageToken = null;

      do {
        const {
          _results: data,
          _pagination: { next },
        } = await fn({
          ...args,
          params: {
            ...params,
            page_token: pageToken,
          },
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        if (next) {
          pageToken = utils.getPageToken(next);
        }
        hasMore = next;

      } while (hasMore);
    },
  },
};
