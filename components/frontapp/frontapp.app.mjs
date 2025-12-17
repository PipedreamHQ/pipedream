import { axios } from "@pipedream/platform";
import retry from "async-retry";
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
            id, name,
          }) => ({
            label: name,
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
    commentId: {
      type: "string",
      label: "Comment ID",
      description: "ID of the comment to retrieve",
      async options({
        prevContext, conversationId,
      }) {
        return this.paginateOptions({
          prevContext,
          listResourcesFn: this.listComments,
          mapper: ({
            id, body,
          }) => ({
            label: body.slice(0, 50),
            value: id,
          }),
          args: {
            conversationId,
          },
        });
      },
    },
    teamId: {
      type: "string",
      label: "Team ID",
      description: "ID of a team",
      async options({ prevContext }) {
        return this.paginateOptions({
          prevContext,
          listResourcesFn: this.listTeams,
          mapper: ({
            id, name,
          }) => ({
            label: name,
            value: id,
          }),
        });
      },
    },
    signatureId: {
      type: "string",
      label: "Signature ID",
      description: "ID of the signature to attach. If ommited, no signature is attached.",
      optional: true,
      async options({
        teamId, prevContext,
      }) {
        return this.paginateOptions({
          prevContext,
          listResourcesFn: this.listSignatures,
          mapper: ({
            id, name,
          }) => ({
            label: name,
            value: id,
          }),
          args: {
            teamId,
          },
        });
      },
    },
    ticketStatusId: {
      type: "string",
      label: "Ticket Status ID",
      description: "ID of the ticket status to retrieve",
      async options({ prevContext }) {
        return this.paginateOptions({
          prevContext,
          listResourcesFn: this.listTicketStatuses,
          mapper: ({
            id, name,
          }) => ({
            label: name,
            value: id,
          }),
        });
      },
    },
    mode: {
      type: "string",
      label: "Mode",
      description: "Mode of the draft to create. Can be 'private' (draft is visible to the author only) or 'shared' (draft is visible to all teammates with access to the conversation).",
      options: [
        "private",
        "shared",
      ],
      optional: true,
    },
    shouldAddDefaultSignature: {
      type: "boolean",
      label: "Should Add Default Signature",
      description: "Whether or not Front should try to resolve a signature for the message. Is ignored if signature_id is included. Default `false`",
      optional: true,
    },
    quoteBody: {
      type: "string",
      label: "Quote Body",
      description: "Body for the quote that the message is referencing. Only available on email channels.",
      optional: true,
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
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      default: 100,
      optional: true,
    },
    messageTemplateId: {
      type: "string",
      label: "Message Template ID",
      description: "The message template ID",
      async options({ prevContext }) {
        return this.paginateOptions({
          prevContext,
          listResourcesFn: this.listMessageTemplates,
          mapper: ({
            id, name,
          }) => ({
            label: name,
            value: id,
          }),
        });
      },
    },
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "ID of the message template folder",
      async options({ prevContext }) {
        return this.paginateOptions({
          prevContext,
          listResourcesFn: this.listMessageTemplateFolders,
          mapper: ({
            id, name,
          }) => ({
            label: name,
            value: id,
          }),
        });
      },
      optional: true,
    },
  },
  methods: {
    getUrl(path, url) {
      return url || `${constants.BASE_URL}${path}`;
    },
    hasMultipartHeader(headers) {
      return headers?.["Content-Type"]?.includes("multipart/form-data");
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
      headers, path, url, data: originalData, ...args
    } = {}) {
      const hasMultipartHeader = this.hasMultipartHeader(headers);
      const isFormData = originalData instanceof FormData;
      const data = (!isFormData && hasMultipartHeader)
        ? utils.getFormData(originalData)
        : originalData;
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
      let retryAfterDelay = null;

      const retryOpts = {
        retries: 3,
        maxTimeout: 30000,
        onRetry: async (err, attempt) => {
          const status = err.response?.status;

          if (status === 429) {
            const retryAfter = err.response?.headers?.["retry-after"];
            if (retryAfter) {
              retryAfterDelay = parseInt(retryAfter) * 1000;
              console.log(`Rate limit exceeded. Waiting ${retryAfter} seconds before retry (attempt ${attempt}/${retryOpts.retries})`);
              // Wait for the Retry-After period
              await new Promise((resolve) => setTimeout(resolve, retryAfterDelay));
            } else {
              console.log(`Rate limit exceeded. Using exponential backoff (attempt ${attempt}/${retryOpts.retries})`);
            }
          } else {
            console.log(`Request failed with status ${status}. Retrying (attempt ${attempt}/${retryOpts.retries})`);
          }
        },
      };

      return retry(async (bail) => {
        try {
          const response = await axios($, config);

          // Log rate limit info for monitoring
          const remaining = response.headers?.["x-ratelimit-remaining"];
          if (remaining !== undefined && parseInt(remaining) < 5) {
            console.log(`Warning: Only ${remaining} API requests remaining before rate limit`);
          }

          return response;
        } catch (error) {
          const status = error.response?.status;

          // Don't retry on client errors (except 429)
          if (status && status >= 400 && status < 500 && status !== 429) {
            console.log("error", error.response?.data);
            bail(error);
            return;
          }

          // Retry on 429 and 5xx errors
          if (status === 429 || (status && status >= 500)) {
            throw error;
          }

          // For other errors, don't retry
          console.log("error", error.response?.data || error.message);
          bail(error);
        }
      }, retryOpts);
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
    async getTicketStatus({
      ticketStatusId, ...args
    }) {
      return this.makeRequest({
        path: `/company/statuses/${ticketStatusId}`,
        ...args,
      });
    },
    async listTeammates(args = {}) {
      return this.makeRequest({
        path: "/teammates",
        ...args,
      });
    },
    async listTicketStatuses(args = {}) {
      return this.makeRequest({
        path: "/company/statuses",
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
    getTeammate({
      teammateId, ...args
    }) {
      return this.makeRequest({
        path: `/teammates/${teammateId}`,
        ...args,
      });
    },
    getConversation({
      conversationId, ...args
    }) {
      return this.makeRequest({
        path: `/conversations/${conversationId}`,
        ...args,
      });
    },
    getComment({
      commentId, ...args
    }) {
      return this.makeRequest({
        path: `/comments/${commentId}`,
        ...args,
      });
    },
    listComments({
      conversationId, ...args
    }) {
      return this.makeRequest({
        path: `/conversations/${conversationId}/comments`,
        ...args,
      });
    },
    listTeams(args = {}) {
      return this.makeRequest({
        path: "/teams",
        ...args,
      });
    },
    listSignatures({
      teamId, ...args
    }) {
      return this.makeRequest({
        path: `/teams/${teamId}/signatures`,
        ...args,
      });
    },
    listCommentMentions({
      commentId, ...args
    }) {
      return this.makeRequest({
        path: `/comments/${commentId}/mentions`,
        ...args,
      });
    },
    addComment({
      conversationId, ...args
    }) {
      return this.makeRequest({
        method: constants.METHOD.POST,
        path: `/conversations/${conversationId}/comments`,
        ...args,
      });
    },
    createDraft({
      channelId, ...args
    }) {
      return this.makeRequest({
        method: constants.METHOD.POST,
        path: `/channels/${channelId}/drafts`,
        ...args,
      });
    },
    createDraftReply({
      conversationId, ...args
    }) {
      return this.makeRequest({
        method: constants.METHOD.POST,
        path: `/conversations/${conversationId}/drafts`,
        ...args,
      });
    },
    updateConversationAssignee({
      conversationId, ...args
    }) {
      return this.makeRequest({
        method: constants.METHOD.PUT,
        path: `/conversations/${conversationId}/assignee`,
        ...args,
      });
    },
    async listMessageTemplates(args = {}) {
      return this.makeRequest({
        path: "/message_templates",
        ...args,
      });
    },
    async listMessageTemplateFolders(args = {}) {
      return this.makeRequest({
        path: "/message_template_folders",
        ...args,
      });
    },
    async updateTeammate({
      teammateId, ...args
    } = {}) {
      return this.makeRequest({
        method: "patch",
        path: `/teammates/${teammateId}`,
        ...args,
      });
    },
    async createInbox(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/inboxes",
        ...args,
      });
    },
    async createMessageTemplate(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/message_templates",
        ...args,
      });
    },
    async deleteMessageTemplate({
      messageTemplateId, ...args
    } = {}) {
      return this.makeRequest({
        method: "delete",
        path: `/message_templates/${messageTemplateId}`,
        ...args,
      });
    },
    async createMessage({
      channelId, ...args
    }) {
      return this.makeRequest({
        method: "post",
        path: `/channels/${channelId}/messages`,
        ...args,
      });
    },
    async paginateOptions({
      prevContext,
      listResourcesFn,
      filter = () => true,
      mapper = (resource) => resource,
      appendNull = false,
      args = {},
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
        ...args,
        params: {
          ...args?.params,
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
      fn, params = {}, maxResults = null, delayMs = 1000, ...args
    }) {
      let hasMore = false;
      let count = 0;
      let pageToken = null;
      let isFirstPage = true;

      do {
        // Add delay between pagination requests to avoid rate limits
        // Skip delay on first page to maintain backward compatibility
        if (!isFirstPage && delayMs > 0) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
        isFirstPage = false;

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
