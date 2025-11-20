import {
  axios, getFileStreamAndMetadata,
} from "@pipedream/platform";
const DEFAULT_LIMIT = 50;

export default {
  type: "app",
  app: "microsoft_outlook",
  propDefinitions: {
    recipients: {
      label: "Recipients",
      description: "Array of email addresses",
      type: "string[]",
      optional: true,
      default: [],
    },
    ccRecipients: {
      label: "CC Recipients",
      description: "Array of email addresses",
      type: "string[]",
      optional: true,
      default: [],
    },
    bccRecipients: {
      label: "BCC Recipients",
      description: "Array of email addresses",
      type: "string[]",
      optional: true,
      default: [],
    },
    subject: {
      label: "Subject",
      description: "Subject of the email",
      type: "string",
      optional: true,
    },
    contentType: {
      label: "Content Type",
      description: "Content type (default `text`)",
      type: "string",
      optional: true,
      options: [
        "text",
        "html",
      ],
      default: "text",
    },
    content: {
      label: "Content",
      description: "Content of the email in text or html format",
      type: "string",
      optional: true,
    },
    files: {
      type: "string[]",
      label: "File Paths or URLs",
      description: "Provide either an array of file URLs or an array of paths to a files in the /tmp directory (for example, /tmp/myFile.pdf).",
      optional: true,
    },
    contact: {
      label: "Contact",
      description: "The contact to be updated",
      type: "string",
      async options({ page }) {
        const limit = DEFAULT_LIMIT;
        const contactResponse = await this.listContacts({
          params: {
            $top: limit,
            $skip: limit * page,
          },
        });
        return contactResponse.value.map((co) => ({
          label: co.displayName,
          value: co.id,
        }));
      },
    },
    givenName: {
      label: "Given name",
      description: "Given name of the contact",
      type: "string",
      optional: true,
    },
    surname: {
      label: "Surname",
      description: "Surname of the contact",
      type: "string",
      optional: true,
    },
    emailAddresses: {
      label: "Email adresses",
      description: "Email addresses",
      type: "string[]",
      optional: true,
    },
    businessPhones: {
      label: "Recipients",
      description: "Array of phone numbers",
      type: "string[]",
      optional: true,
    },
    expand: {
      label: "Expand",
      description: "Additional properties",
      type: "object",
      optional: true,
    },
    label: {
      type: "string",
      label: "Label",
      description: "The name of the label/category to add",
      async options({
        messageId, excludeMessageLabels, onlyMessageLabels,
      }) {
        const { value } = await this.listLabels();
        let labels = value;
        if (messageId) {
          const { categories } = await this.getMessage({
            messageId,
          });
          labels = excludeMessageLabels
            ? labels.filter(({ displayName }) => !categories.includes(displayName))
            : onlyMessageLabels
              ? labels.filter(({ displayName }) => categories.includes(displayName))
              : labels;
        }
        return labels?.map(({ displayName }) => displayName) || [];
      },
    },
    messageId: {
      type: "string",
      label: "Message ID",
      description: "The identifier of the message to update",
      async options({ page }) {
        const limit = DEFAULT_LIMIT;
        const { value } = await this.listMessages({
          params: {
            $top: limit,
            $skip: limit * page,
            $orderby: "createdDateTime desc",
          },
        });
        return value?.map(({
          id: value, subject: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    folderIds: {
      type: "string[]",
      label: "Folder IDs to Monitor",
      description: "Specify the folder IDs or names in Outlook that you want to monitor for new emails. Leave empty to monitor all folders (excluding \"Sent Items\" and \"Drafts\").",
      async options({ page }) {
        const limit = DEFAULT_LIMIT;
        const { value: folders } = await this.listFolders({
          params: {
            $top: limit,
            $skip: limit * page,
          },
        });
        return folders?.map(({
          id: value, displayName: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    attachmentId: {
      type: "string",
      label: "Attachment ID",
      description: "The identifier of the attachment to download",
      async options({
        messageId, page,
      }) {
        const limit = DEFAULT_LIMIT;
        const { value: attachments } = await this.listAttachments({
          messageId,
          params: {
            $top: limit,
            $skip: limit * page,
          },
        });
        return attachments?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user to get messages for",
      useQuery: true,
      async options({query}) {
        const { value: users } = await this.listUsers({ "$search" : query });
        return users?.map(({
          id: value, displayName, mail,
        }) => ({
          value,
          label: `${displayName} (${mail})`,
        })) || [];
      },
    },
    sharedFolderId: {
      type: "string",
      label: "Shared Folder ID",
      description: "The ID of the shared folder to get messages for",
      async options({
        userId, page,
      }) {
        const sharedFolders = await this.listSharedFolders({
          userId,
          params: {
            $top: DEFAULT_LIMIT,
            $skip: DEFAULT_LIMIT * page,
          },
        });

        return sharedFolders?.map(({
          id: value, displayName,
        }) => ({
          value,
          label: displayName,
        })) || [];
      },
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      default: 100,
      optional: true,
    },
    search: {
      type: "string",
      label: "Search",
      description: "Search for an email in Microsoft Outlook. Can search for specific message properties such as `\"to:example@example.com\"` or `\"subject:example\"`. If the property is excluded, the search targets the default propertes `from`, `subject`, and `body`. For example, `\"pizza\"` will search for messages with the word `pizza` in the subject, body, or from address, but `\"to:example@example.com\"` will only search for messages to `example@example.com`.",
      optional: true,
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "Filters results. For example, `contains(subject, 'meet for lunch?')` will include messages whose subject contains ‘meet for lunch?’. [See documentation](https://learn.microsoft.com/en-us/graph/filter-query-parameter) for the full list of operations.",
      optional: true,
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Order results by a property. For example, `receivedDateTime desc` will order messages by the received date in descending order.",
      optional: true,
    },
  },
  methods: {
    _getUrl(path) {
      return `https://graph.microsoft.com/v1.0${path}`;
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "accept": "application/json",
        "Content-Type": "application/json",
      };
    },
    async _makeRequest({
      $,
      path,
      headers,
      ...otherConfig
    } = {}) {
      const config = {
        url: this._getUrl(path),
        headers: this._getHeaders(headers),
        ...otherConfig,
      };
      try {
        return await axios($ ?? this, config);
      } catch (error) {
        if (error?.response?.status === 403) {
          throw new Error("Insufficient permissions. Please verify that your Microsoft account has the necessary permissions to perform this operation.");
        }
        throw error;
      }
    },
    async createHook({ ...args } = {}) {
      const response = await this._makeRequest({
        method: "POST",
        path: "/subscriptions",
        ...args,
      });
      return response;
    },
    async renewHook({
      hookId,
      ...args
    } = {}) {
      return await this._makeRequest({
        method: "PATCH",
        path: `/subscriptions/${hookId}`,
        ...args,
      });
    },
    async deleteHook({
      hookId,
      ...args
    } = {}) {
      return await this._makeRequest({
        method: "DELETE",
        path: `/subscriptions/${hookId}`,
        ...args,
      });
    },
    async streamToBase64(stream) {
      return new Promise((resolve, reject) => {
        const chunks = [];

        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => {
          const buffer = Buffer.concat(chunks);
          resolve(buffer.toString("base64"));
        });
        stream.on("error", reject);
      });
    },
    async prepareMessageBody(self) {
      const toRecipients = [];
      const ccRecipients = [];
      const bccRecipients = [];
      for (const address of self.recipients) {
        toRecipients.push({
          emailAddress: {
            address,
          },
        });
      }
      for (const address of self.ccRecipients) {
        if (address.trim() !== "") {
          ccRecipients.push({
            emailAddress: {
              address,
            },
          });
        }
      }
      for (const address of self.bccRecipients) {
        if (address.trim() !== "") {
          bccRecipients.push({
            emailAddress: {
              address,
            },
          });
        }
      }

      const attachments = [];
      for (let i = 0; self.files && i < self.files.length; i++) {
        const {
          stream, metadata,
        } = await getFileStreamAndMetadata(self.files[i]);
        const base64 = await this.streamToBase64(stream);
        attachments.push({
          "@odata.type": "#microsoft.graph.fileAttachment",
          "name": metadata.name,
          "contentType": metadata.contentType,
          "contentBytes": base64,
        });
      }
      const message = {
        subject: self.subject,
        attachments,
      };

      if (self.content) {
        message.body = {
          content: self.content,
          contentType: self.contentType,
        };
      }
      if (toRecipients.length > 0) message.toRecipients = toRecipients;
      if (ccRecipients.length > 0) message.ccRecipients = ccRecipients;
      if (bccRecipients.length > 0) message.bccRecipients = bccRecipients;

      return message;
    },
    async sendEmail({ ...args } = {}) {
      return await this._makeRequest({
        method: "POST",
        path: "/me/sendMail",
        ...args,
      });
    },
    async replyToEmail({
      messageId, ...args
    }) {
      return await this._makeRequest({
        method: "POST",
        path: `/me/messages/${messageId}/reply`,
        ...args,
      });
    },
    async createDraft({ ...args } = {}) {
      return await this._makeRequest({
        method: "POST",
        path: "/me/messages",
        ...args,
      });
    },
    async createContact({ ...args } = {}) {
      return await this._makeRequest({
        method: "POST",
        path: "/me/contacts",
        ...args,
      });
    },
    async listContacts({
      filterAddress,
      ...args
    } = {}) {
      args.params = {
        ...args?.params,
      };
      if (filterAddress) {
        args.params["$filter"] = `emailAddresses/any(a:a/address eq '${filterAddress}')`;
      }
      return await this._makeRequest({
        method: "GET",
        path: "/me/contacts",
        ...args,
      });
    },
    async updateContact({
      contactId,
      ...args
    } = {}) {
      return await this._makeRequest({
        method: "PATCH",
        path: `/me/contacts/${contactId}`,
        ...args,
      });
    },
    async getMessage({
      messageId,
      ...args
    } = {}) {
      return await this._makeRequest({
        method: "GET",
        path: `/me/messages/${messageId}`,
        ...args,
      });
    },
    async listMessages({ ...args } = {}) {
      return await this._makeRequest({
        method: "GET",
        path: "/me/messages",
        ...args,
      });
    },
    async listSharedFolderMessages({
      userId, sharedFolderId, ...args
    } = {}) {
      return await this._makeRequest({
        method: "GET",
        path: `/users/${userId}/mailFolders/${sharedFolderId}/messages`,
        ...args,
      });
    },
    async getContact({
      contactId,
      ...args
    } = {}) {
      return await this._makeRequest({
        method: "GET",
        path: `/me/contacts/${contactId}`,
        ...args,
      });
    },
    listLabels(args = {}) {
      return this._makeRequest({
        path: "/me/outlook/masterCategories",
        ...args,
      });
    },
    listFolders(args = {}) {
      return this._makeRequest({
        path: "/me/mailFolders",
        ...args,
      });
    },
    moveMessage({
      messageId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/me/messages/${messageId}/move`,
        ...args,
      });
    },
    updateMessage({
      messageId, ...args
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/me/messages/${messageId}`,
        ...args,
      });
    },
    getAttachment({
      messageId, attachmentId, ...args
    }) {
      return this._makeRequest({
        path: `/me/messages/${messageId}/attachments/${attachmentId}/$value`,
        ...args,
      });
    },
    listAttachments({
      messageId, ...args
    }) {
      return this._makeRequest({
        path: `/me/messages/${messageId}/attachments`,
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "/users",
        ...args,
      });
    },
    async listSharedFolders({
      userId, parentFolderId, ...args
    } = {}) {
      const { value } = await this._makeRequest({
        path: `/users/${userId}/mailFolders${parentFolderId
          ? `/${parentFolderId}/childFolders`
          : ""}`,
        ...args,
      });

      const foldersArray = [];
      for (const folder of value) {
        foldersArray.push(folder);
        foldersArray.push(...await this.listSharedFolders({
          userId,
          parentFolderId: folder.id,
          ...args,
        }));
      }

      return foldersArray;
    },
    async *paginate({
      fn, args = {}, max,
    }) {
      const limit = DEFAULT_LIMIT;
      args = {
        ...args,
        params: {
          ...args?.params,
          $top: limit,
          $skip: 0,
        },
      };
      let total, count = 0;
      do {
        const { value } = await fn(args);
        for (const item of value) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        total = value?.length;
        args.params["$skip"] += limit;
      } while (total);
    },
  },
};
