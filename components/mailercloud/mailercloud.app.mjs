import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "mailercloud",
  propDefinitions: {
    listId: {
      type: "string",
      label: "List ID",
      description: "The ID of the list to add a new contact to",
      async options({ page }) {
        const { data: lists } = await this.listLists({
          data: {
            limit: constants.DEFAULT_LIMIT,
            page: page + 1,
            list_type: 1,
          },
        });
        return lists?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact to be updated",
      async options({
        listId, page,
      }) {
        const { data: contacts } = await this.listContacts({
          listId,
          data: {
            limit: constants.DEFAULT_LIMIT,
            page: page + 1,
          },
        });
        return contacts?.map(({
          id: value, email: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the contact",
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
    zip: {
      type: "string",
      label: "Zip",
      description: "The zip code of the contact",
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
    industry: {
      type: "string",
      label: "Industry",
      description: "The industry of the contact",
      optional: true,
    },
    department: {
      type: "string",
      label: "Department",
      description: "The department of the contact",
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "The job title of the contact",
      optional: true,
    },
    organization: {
      type: "string",
      label: "Organization",
      description: "The organization of the contact",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://cloudapi.mailercloud.com/v1";
    },
    _headers() {
      return {
        "Authorization": `${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
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
        headers: this._headers(),
      });
    },
    listLists(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/lists/search",
        ...opts,
      });
    },
    listContacts({
      listId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/contact/search/${listId}`,
        ...opts,
      });
    },
    createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        ...opts,
      });
    },
    updateContact({
      contactId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/contacts/${contactId}`,
        ...opts,
      });
    },
    createList(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/list",
        ...opts,
      });
    },
  },
};
