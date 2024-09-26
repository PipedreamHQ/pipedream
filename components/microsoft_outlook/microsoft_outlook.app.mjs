import { axios } from "@pipedream/platform";
import fs from "fs";
import path from "path";
import { encode } from "js-base64";
import mime from "mime-types";

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
      label: "File paths",
      description: "Absolute paths to the files (eg. `/tmp/my_file.pdf`)",
      type: "string[]",
      optional: true,
    },
    contact: {
      label: "Contact",
      description: "The contact to be updated",
      type: "string",
      async options() {
        const contactResponse = await this.listContacts();
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
      return axios($ ?? this, config);
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
    prepareMessageBody(self) {
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
        attachments.push({
          "@odata.type": "#microsoft.graph.fileAttachment",
          "name": path.basename(self.files[i]),
          "contentType": mime.lookup(self.files[i]),
          "contentBytes": encode([
            ...fs.readFileSync(self.files[i], {
              flag: "r",
            }).values(),
          ]),
        });
      }
      const message = {
        subject: self.subject,
        body: {
          content: self.content,
          contentType: self.contentType,
        },
        toRecipients,
        attachments,
      };

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
      const paramsContainer = {};
      if (filterAddress) {
        paramsContainer.params = {
          "$filter": `emailAddresses/any(a:a/address eq '${filterAddress}')`,
        };
      }
      return await this._makeRequest({
        method: "GET",
        path: "/me/contacts",
        ...paramsContainer,
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
  },
};
