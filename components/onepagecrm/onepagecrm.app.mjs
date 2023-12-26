import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "onepage_crm",
  version: "0.0.{{ts}}",
  propDefinitions: {
    newContactTriggerSorting: {
      type: "string",
      label: "Sorting for New Contact Trigger",
      description: "Sort the results by the created_at field in descending order",
      default: "created_at desc",
    },
    closedDealTriggerSorting: {
      type: "string",
      label: "Sorting for Closed Deal Trigger",
      description: "Sort the results by the created_at field in descending order and filter by status closed",
      default: "created_at desc, status closed",
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The unique identifier for the contact",
      async options({ prevContext }) {
        const page = prevContext.page
          ? prevContext.page
          : 1;
        const response = await this.listContacts({
          page,
        });
        return {
          options: response.contacts.map((contact) => ({
            label: contact.first_name + " " + contact.last_name,
            value: contact.id,
          })),
          context: {
            page: page + 1,
          },
        };
      },
    },
    contactData: {
      type: "object",
      label: "Contact Data",
      description: "The data for creating a new contact",
    },
    dealId: {
      type: "string",
      label: "Deal ID",
      description: "The unique identifier for the deal",
    },
    dealData: {
      type: "object",
      label: "Deal Data",
      description: "The data for updating a deal's details",
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.onepagecrm.com/api/v3";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-OnePageCRM-UID": this.$auth.user_id,
          "X-OnePageCRM-API-Key": this.$auth.api_key,
        },
      });
    },
    async listContacts(opts = {}) {
      const {
        sort_by = "created_at", order = "desc", ...otherOpts
      } = opts;
      return this._makeRequest({
        path: "/contacts.json",
        params: {
          sort_by,
          order,
          ...otherOpts,
        },
      });
    },
    async createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts.json",
        data: opts,
      });
    },
    async removeContact(opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/contacts/${opts.contactId}.json`,
      });
    },
    async updateDeal(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: `/deals/${opts.dealId}.json`,
        data: opts.dealData,
      });
    },
    async listDeals(opts = {}) {
      const {
        sort_by = "created_at", order = "desc", status = "closed", ...otherOpts
      } = opts;
      return this._makeRequest({
        path: "/deals.json",
        params: {
          sort_by,
          order,
          status,
          ...otherOpts,
        },
      });
    },
  },
};
