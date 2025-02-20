import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "benchmarkone",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The unique identifier of the contact.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Contact's first name.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Contact's last name.",
    },
    status: {
      type: "string",
      label: "Status",
      description: "Contact's status.",
      withLabel: true,
      async options() {
        const data = await this.listContactStatuses();
        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    temperature: {
      type: "string",
      label: "Temperature",
      description: "Contact's temperature.",
      withLabel: true,
      async options() {
        const data = await this.listTemperatures();
        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    title: {
      type: "string",
      label: "Title",
      description: "The contact's title.",
    },
    company: {
      type: "string",
      label: "Company",
      description: "The contact's company name.",
    },
    emails: {
      type: "string[]",
      label: "Email Addresses",
      description: "A list of objects of contact's email address. **Example: [ { \"address\": \"email@benchmarkone.com\", \"type\": \"Home\" } ]** [See the documentation](https://sandbox.hatchbuck.com/api/dist/#!/Contacts/post_contact) for further details.",
    },
    phones: {
      type: "string[]",
      label: "Phones",
      description: "A list of objects of contact's phone numbers. **Example: [ { \"number\": \"(123)4567890\", \"type\": \"Work\" } ]** [See the documentation](https://sandbox.hatchbuck.com/api/dist/#!/Contacts/post_contact) for further details.",
    },
    addresses: {
      type: "string[]",
      label: "Addresses",
      description: "A list of objects of contact's addresses. **Example: [ { \"street\": \"string\", \"city\": \"string\", \"state\": \"string\", \"zip\": \"string\", \"country\": \"string\", \"type\": \"string\" } ]** [See the documentation](https://sandbox.hatchbuck.com/api/dist/#!/Contacts/post_contact) for further details.",
    },
    website: {
      type: "string",
      label: "Website",
      description: "The contact's website.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.hatchbuck.com/api/v1";
    },
    _params(params = {}) {
      return {
        api_key: this.$auth.api_key,
        ...params,
      };
    },
    _makeRequest({
      $ = this, path, params, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        params: this._params(params),
        ...opts,
      });
    },
    listContactStatuses() {
      return this._makeRequest({
        path: "/settings/contactStatus",
      });
    },
    listTemperatures() {
      return this._makeRequest({
        path: "/settings/temperature",
      });
    },
    createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contact",
        ...opts,
      });
    },
    updateContact(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "/contact",
        ...opts,
      });
    },
    addNoteToContact({
      contactId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/contact/${contactId}/notes`,
        ...opts,
      });
    },
    addTagToContact({
      contactId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/contact/${contactId}/tags`,
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Webhook/Addwebhook",
        ...opts,
      });
    },
  },
};
