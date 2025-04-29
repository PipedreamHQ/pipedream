import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "heyy",
  propDefinitions: {
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the contact. It must be in E.164 format. Eg: `+14155552671`. For more information please see [here](https://en.wikipedia.org/wiki/E.164).",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the contact.",
      optional: true,
    },
    labels: {
      type: "string[]",
      label: "Labels",
      description: "The labels associated with the contact.",
      optional: true,
      async options() {
        const { data } = await this.getLabels();
        return data.map(({ name }) => name);
      },
    },
    attributes: {
      type: "object",
      label: "Attributes",
      description: "The attributes associated with the contact.",
      optional: true,
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The unique identifier of the contact.",
      async options({
        page,
        mapper = ({
          id: value, firstName, phoneNumber,
        }) => ({
          label: firstName || phoneNumber,
          value,
        }),
      }) {
        const { data: { contacts } } = await this.getContacts({
          params: {
            page,
            sortBy: "updatedAt",
            order: "DESC",
          },
        });
        return contacts.map(mapper);
      },
    },
    channelId: {
      type: "string",
      label: "Channel ID",
      description: "The unique identifier of the channel.",
      async options({
        mapper = ({
          id: value, whatsappPhoneNumber: { name: label },
        }) => ({
          label,
          value,
        }),
      }) {
        const { data } = await this.getChannels();
        return data.map(mapper);
      },
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        Authorization: `Bearer ${this.$auth.api_token}`,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    put(args = {}) {
      return this._makeRequest({
        method: "PUT",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        ...args,
      });
    },
    getLabels(args = {}) {
      return this._makeRequest({
        path: "/labels",
        ...args,
      });
    },
    getAttributes(args = {}) {
      return this._makeRequest({
        path: "/attributes",
        ...args,
      });
    },
    getContacts(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...args,
      });
    },
    getMessageTemplates(args = {}) {
      return this._makeRequest({
        path: "/message_templates",
        ...args,
      });
    },
    getChannels(args = {}) {
      return this._makeRequest({
        path: "/channels",
        ...args,
      });
    },
  },
};
