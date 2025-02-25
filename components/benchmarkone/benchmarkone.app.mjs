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
    workEmail: {
      type: "string",
      label: "Work Email Address",
      description: "A contact's work email address.",
    },
    homeEmail: {
      type: "string",
      label: "Home Email Address",
      description: "A contact's home email address.",
    },
    workPhone: {
      type: "string",
      label: "Work Phone",
      description: "A contact's work phone number.",
    },
    homePhone: {
      type: "string",
      label: "Home Phone",
      description: "A contact's home phone number.",
    },
    workAddress: {
      type: "object",
      label: "Work Address",
      description: "An object of contact's work address.",
      default: {
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
      },
    },
    homeAddress: {
      type: "object",
      label: "Home Address",
      description: "An object of contact's home address.",
      default: {
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
      },
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
