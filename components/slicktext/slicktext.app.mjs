import { axios } from "@pipedream/platform";
import {
  LIMIT, OPT_IN_STATUS_OPTIONS, TIMEZONE_OPTIONS,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "slicktext",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact to be updated",
      async options({ page }) {
        const { data } = await this.listContacts({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });

        return data.map(({
          contact_id: value, first_name: fName, last_name: lName, email,
        }) => ({
          label: `${fName} ${lName} (${email})`,
          value,
        }));
      },
    },
    listIds: {
      type: "string[]",
      label: "List IDs",
      description: "A list of **List IDs** that represent the list(s) the contact will be added to",
      async options({ page }) {
        const { data } = await this.listLists({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });

        return data.map(({
          contact_list_id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    mobileNumber: {
      type: "string",
      label: "Mobile Number",
      description: "The US phone number of the contact. Must be at least 10 digits. It will be normalized to digits-only, preceded by a +",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of contact",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of contact",
    },
    email: {
      type: "string",
      label: "Email Address",
      description: "The email address of the contact",
    },
    birthdate: {
      type: "string",
      label: "Birthdate",
      description: "The birthday of the contact formatted as: YYYY-MM-DD",
    },
    address: {
      type: "string",
      label: "Address",
      description: "The street address of the contact",
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the contact",
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the contact",
    },
    zip: {
      type: "string",
      label: "Zip Code",
      description: "The zip code of the contact",
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country of the contact",
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "The time zone of contact",
      options: TIMEZONE_OPTIONS,
    },
    language: {
      type: "string",
      label: "Language",
      description: "The primary language of contact (“en”)",
    },
    optInStatus: {
      type: "string",
      label: "Opt-in Status",
      description: "The opt-in status of contact (Default is not subscribed)",
      options: OPT_IN_STATUS_OPTIONS,
    },
    forceDoubleOptIn: {
      type: "boolean",
      label: "Force Double Opt-in",
      description: "Set to “true” to force the user to agree to subscribing via double opt-in message",
    },
  },
  methods: {
    _baseUrl() {
      return "https://dev.slicktext.com/v1";
    },
    _headers() {
      return {
        authorization: `Bearer ${this.$auth.public_api_key}`,
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
    async getBrandId() {
      const response = await this._makeRequest({
        path: "/brands",
      });
      return response.brand_id;
    },
    async listContacts(opts = {}) {
      const brandId = await this.getBrandId();
      return this._makeRequest({
        path: `/brands/${brandId}/contacts`,
        ...opts,
      });
    },
    async listLists(opts = {}) {
      const brandId = await this.getBrandId();
      return this._makeRequest({
        path: `/brands/${brandId}/lists`,
        ...opts,
      });
    },
    async createContact(opts =  {}) {
      const brandId = await this.getBrandId();
      return this._makeRequest({
        method: "POST",
        path: `/brands/${brandId}/contacts`,
        ...opts,
      });
    },
    async updateContact({
      contactId, ...opts
    }) {
      const brandId = await this.getBrandId();
      return this._makeRequest({
        method: "PUT",
        path: `/brands/${brandId}/contacts/${contactId}`,
        ...opts,
      });
    },
    async addContactToLists(opts = {}) {
      const brandId = await this.getBrandId();
      return this._makeRequest({
        method: "POST",
        path: `/brands/${brandId}/lists/contacts`,
        ...opts,
      });
    },
  },
};
