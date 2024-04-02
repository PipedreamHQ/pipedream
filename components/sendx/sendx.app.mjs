import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sendx",
  propDefinitions: {
    contactDetails: {
      type: "object",
      label: "Contact Details",
      description: "The details of the contact to create or update, including name, email, and other essential information.",
    },
    contactEmail: {
      type: "string",
      label: "Contact Email",
      description: "The email of the contact.",
    },
    tag: {
      type: "string",
      label: "Tag",
      description: "The tag to associate with a contact.",
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
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact.",
    },
    newEmail: {
      type: "string",
      label: "New Email",
      description: "The new email of the contact if it needs to be updated.",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "The company of the contact.",
      optional: true,
    },
    birthday: {
      type: "string",
      label: "Birthday",
      description: "The birthday of the contact in YYYY-MM-DD format.",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Custom fields for the contact.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags to associate with the contact.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.sendx.io/api/v1";
    },
    _headers() {
      return {
        "api_key": `${this.$auth.api_key}`,
      };
    },
    _params(params) {
      return {
        ...params,
        team_id: `${this.$auth.team_id}`,
      };
    },
    _makeRequest({
      $ = this, path, params, ...otherOpts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        params: this._params(params),
        ...otherOpts,
      });
    },
    upsertContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contact/identify",
        ...opts,
      });
    },
    updateTag(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contact/track",
        ...opts,
      });
    },
  },
};
