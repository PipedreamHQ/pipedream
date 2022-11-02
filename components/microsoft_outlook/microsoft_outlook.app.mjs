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
    },
    subject: {
      label: "Subject",
      description: "Subject of the email",
      type: "string",
    },
    contentType: {
      label: "Content Type",
      description: "Content type (default `text`)",
      type: "string",
      optional: true,
      options: ["text", "html"],
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
    timeZone: {
      label: "Time Zone",
      description: "Time zone of the event in supported time zones, [See the docs](https://docs.microsoft.com/en-us/graph/api/outlookuser-supportedtimezones)",
      type: "string",
      async options() {
        const timeZonesResponse = await this.getSupportedTimeZones();
        return timeZonesResponse.value.map((tz) => ({
          label: tz.displayName,
          value: tz.alias,
        }));
      },
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
    start: {
      label: "Start",
      description: "Start date-time (yyyy-MM-ddThh:mm:ss) e.g. '2022-04-15T11:20:00'",
      type: "string",
    },
    end: {
      label: "End",
      description: "End date-time (yyyy-MM-ddThh:mm:ss) e.g. '2022-04-15T13:30:00'",
      type: "string",
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
    attendees: {
      label: "Attendees",
      description: "Array of email addresses",
      type: "string[]",
    },
    location: {
      label: "Location",
      description: "Location of the event",
      type: "string",
      optional: true,
    },
    isOnlineMeeting: {
      label: "Is Online Meeting",
      description: "If it is online meeting or not",
      type: "boolean",
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
      for (const address of self.recipients) {
        toRecipients.push({
          emailAddress: {
            address,
          },
        });
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
      return message;
    },
    async getSupportedTimeZones() {
      return await this._makeRequest({
        method: "GET",
        path: "/me/outlook/supportedTimeZones",
      });
    },
    async createCalendarEvent({ ...args } = {}) {
      return await this._makeRequest({
        method: "POST",
        path: "/me/events",
        ...args,
      });
    },
    async listCalendarEvents({ ...args } = {}) {
      return await this._makeRequest({
        method: "GET",
        path: "/me/events",
        ...args,
      });
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
    async getCalendarEvent({
      eventId,
      ...args
    } = {}) {
      return await this._makeRequest({
        method: "GET",
        path: `/me/events/${eventId}`,
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
