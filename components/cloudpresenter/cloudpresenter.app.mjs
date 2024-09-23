import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "cloudpresenter",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact UUID",
      description: "Unique identifier for the contact",
      async options({ page }) {
        const { data } = await this.listContacts({
          params: {
            page: page + 1,
          },
        });
        if (!data?.contacts) {
          return [];
        }
        return data.contacts.data?.map(({
          uuid: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    tagIds: {
      type: "string[]",
      label: "Tag IDs",
      description: "Unique identifiers for the tags to associate with the contact",
      optional: true,
      async options({ page }) {
        const { data } = await this.listTags({
          params: {
            page: page + 1,
          },
        });
        return data?.map(({
          id: value, tag_name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    customFieldIds: {
      type: "integer[]",
      label: "Custom Field IDs",
      description: "The IDs of custom fields to add to the contact",
      optional: true,
      async options() {
        const { data } = await this.listCustomFields();
        return data?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the contact",
    },
    company: {
      type: "string",
      label: "Company",
      description: "The company of the contact",
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "The job title of the contact",
      optional: true,
    },
    streetAddress: {
      type: "string",
      label: "Street Address",
      description: "The street address of the contact",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the contact",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the contact",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country of the contact",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the contact",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api2.cloudpresenter.com/v1";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "origin": `${this.$auth.api_base_url}`,
          "workspace": `${this.$auth.workspace_id}`,
        },
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },
    listTags(opts = {}) {
      return this._makeRequest({
        path: "/tags",
        ...opts,
      });
    },
    listCustomFields(opts = {}) {
      return this._makeRequest({
        path: "/custom-fields/all",
        ...opts,
      });
    },
    createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contact",
        ...opts,
      });
    },
    updateContact({
      contactId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/contact/${contactId}`,
        ...opts,
      });
    },
  },
};
