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
    contactIdentification: {
      type: "string",
      label: "Contact Identification",
      description: "The identification detail of the contact, used for associating or de-associating tags.",
    },
    tag: {
      type: "string",
      label: "Tag",
      description: "The tag to associate or de-associate with a contact.",
      optional: true,
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
      return "https://api.sendx.io";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async createOrUpdateContact({
      email, firstName, lastName, newEmail, company, birthday, customFields, tags,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/contact/identify",
        data: {
          email,
          firstName,
          lastName,
          newEmail,
          company,
          birthday,
          customFields,
          tags,
        },
      });
    },
    async associateTag({
      contactIdentification, tag,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/contact/track",
        data: {
          email: contactIdentification,
          addTags: [
            tag,
          ],
        },
      });
    },
    async deAssociateTag({
      contactIdentification, tag,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/contact/track",
        data: {
          email: contactIdentification,
          removeTags: [
            tag,
          ],
        },
      });
    },
  },
};
