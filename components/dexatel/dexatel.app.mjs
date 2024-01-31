import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dexatel",
  propDefinitions: {
    audienceId: {
      type: "string",
      label: "Audience Id",
      description: "The identifier of the audience.",
      async options({
        page, prevContext,
      }) {
        const {
          data, pagination,
        } = await this.listAudences({
          params: {
            page,
            page_token: prevContext.page_token,
          },
        });

        return {
          options: data.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            page_token: new URLSearchParams(pagination.links.next).get("page_token"),
          },
        };
      },
    },
    senderId: {
      type: "string",
      label: "Sender Id",
      description: "The identifier of the sender.",
      async options({
        page, prevContext,
      }) {
        const {
          data, pagination,
        } = await this.listSenders({
          params: {
            page,
            page_token: prevContext.page_token,
          },
        });

        return {
          options: data.map(({ name }) => name),
          context: {
            page_token: new URLSearchParams(pagination.links.next).get("page_token"),
          },
        };
      },
    },
    templateId: {
      type: "string",
      label: "Template Id",
      description: "The identifier of the template.",
      async options({
        page, prevContext,
      }) {
        const {
          data, pagination,
        } = await this.listTemplates({
          params: {
            page,
            page_token: prevContext.page_token,
          },
        });

        return {
          options: data.map(({ name }) => name),
          context: {
            page_token: new URLSearchParams(pagination.links.next).get("page_token"),
          },
        };
      },
    },
    firstName: {
      type: "string",
      label: "Contact First Name",
      description: "The first name of the contact.",
    },
    lastName: {
      type: "string",
      label: "Contact Last Name",
      description: "The last name of the contact.",
    },
    number: {
      type: "string",
      label: "Contact Number",
      description: "The phone number of the contact.",
    },
    recipientNumber: {
      type: "string",
      label: "Recipient Number",
      description: "The phone number of the message recipient.",
    },
    messageContent: {
      type: "string",
      label: "Message Content",
      description: "The content of the message to send.",
    },
    recipientNumbers: {
      type: "string[]",
      label: "Recipient Numbers",
      description: "An array of phone numbers to send messages in bulk.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.dexatel.com/v1";
    },
    _headers() {
      return {
        "Content-Type": "application/json",
        "X-Dexatel-Key": `${this.$auth.api_key}`,
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
    createContact({
      audienceId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/audiences/${audienceId}/contacts`,
        ...opts,
      });
    },
    listAudences( opts = {}) {
      return this._makeRequest({
        path: "/audiences",
        ...opts,
      });
    },
    listSenders( opts = {}) {
      return this._makeRequest({
        path: "/senders",
        ...opts,
      });
    },
    listTemplates( opts = {}) {
      return this._makeRequest({
        path: "/templates",
        ...opts,
      });
    },
    sendMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/messages",
        ...opts,
      });
    },
  },
};
