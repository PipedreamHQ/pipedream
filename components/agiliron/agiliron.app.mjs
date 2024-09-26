import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "agiliron",
  propDefinitions: {
    contactName: {
      type: "string",
      label: "Contact Name",
      description: "The name of the contact related to the event",
      async options({ page }) {
        const { Contacts: { Contact } } = await this.getContacts({
          params: {
            filter: "CreatedTime,ge,01-01-1970",
            page: page + 1,
          },
        });

        return Contact.map(({
          FirstName, LastName,
        }) => `${FirstName} ${LastName}`);
      },
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the lead",
    },
    lastname: {
      type: "string",
      label: "Last Name",
      description: "The last name of the lead.",
    },
    salutation: {
      type: "string",
      label: "Salutation",
      description: "The salutation of the lead",
      options: constants.SALUTATION_OPTIONS,
    },
    mobile: {
      type: "string",
      label: "Mobile",
      description: "The mobile number of the lead",
    },
    fax: {
      type: "string",
      label: "Fax",
      description: "The fax number of the lead",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the lead",
    },
    contactType: {
      type: "string",
      label: "Contact Type",
      description: "The contact type of the lead",
      options: constants.CONTACT_TYPE_OPTIONS,
    },
    leadSource: {
      type: "string",
      label: "Lead Source",
      description: "The lead source of the lead",
      options: constants.LEAD_SOURCE_OPTIONS,
    },
    emailOptOut: {
      type: "string",
      label: "Email Opt Out",
      description: "The email opt-out status of the lead",
      options: constants.BOOL_OPTIONS,
    },
    yahooId: {
      type: "string",
      label: "Yahoo ID",
      description: "The Yahoo ID of the lead",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the lead",
    },
    assignedTo: {
      type: "string",
      label: "Assigned To",
      description: "The user to whom the lead is assigned",
      options: constants.ASSIGNED_TO_OPTIONS,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "An object of custom fields for the lead. **Format: {customFieldName01: \"Value 01\"}**",
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.subdomain}.agiliron.net/agiliron/api-40`;
    },
    _headers(headers) {
      return {
        ...headers,
        Accept: "application/json",
        apiKey: this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(headers),
        ...opts,
      });
    },
    addContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Contact",
        ...opts,
      });
    },
    addLead(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Leads",
        ...opts,
      });
    },
    addEvent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Event",
        ...opts,
      });
    },
    getContacts(opts = {}) {
      return this._makeRequest({
        path: "/Contact",
        ...opts,
      });
    },
    getLeads(opts = {}) {
      return this._makeRequest({
        path: "/Leads",
        ...opts,
      });
    },
    getTasks(opts = {}) {
      return this._makeRequest({
        path: "/Task",
        ...opts,
      });
    },
    async prepareItems({
      type, page,
    }) {
      if (type === "Invoice" || type === "Potentials") return [];

      const parsedType = type.replace(/ +/g, "");
      const typeFields = constants.TYPE_FIELDS[parsedType];

      const response = await this._makeRequest({
        path: `/${typeFields.path || parsedType}`,
        params: {
          filter: `${typeFields.filterField},ge,01-01-1970`,
          page,
        },
      });

      const items = response[typeFields.item][typeFields.subItem];
      return items.map((item) => {
        let nameString = "";
        typeFields.names.map((name) => {nameString += `${item[name]} `;});
        return nameString;
      });
    },
    async *paginate({
      fn, params = {}, fields,
    }) {
      let hasMore = false;
      let page = 0;

      do {
        try {
          params.page = ++page;
          const response = await fn({
            params,
          });
          const pagination = response[fields.item];
          const data = pagination[fields.subItem];
          for (const d of data) {
            yield d;
          }

          hasMore = !(pagination.CurrentPage === pagination.TotalPages);
        } catch (e) {
          return false;
        }
      } while (hasMore);
    },
  },
};
