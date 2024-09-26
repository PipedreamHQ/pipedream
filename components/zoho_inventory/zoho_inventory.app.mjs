import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "zoho_inventory",
  propDefinitions: {
    organization: {
      type: "string",
      label: "Organization",
      description: "Select the organization",
      async options({ page }) {
        const params = {
          per_page: constants.DEFAULT_PAGE_SIZE,
          page: page + 1,
        };
        const { organizations } = await this.listOrganizations({
          params,
        });
        return organizations.map((org) => ({
          label: org.name,
          value: org.organization_id,
        }));
      },
    },
    customer: {
      type: "string",
      label: "Customer",
      description: "Customer to assign to sales order",
      async options({ page }) {
        const params = {
          per_page: constants.DEFAULT_PAGE_SIZE,
          page: page + 1,
        };
        const { contacts } = await this.listContacts({
          params,
        });
        return contacts
          .filter((contact) => contact.contact_type === "customer")
          .map((contact) => ({
            label: contact.contact_name,
            value: contact.contact_id,
          }));
      },
    },
    items: {
      type: "string[]",
      label: "Item",
      description: "Items contained in the sales order",
      async options({ page }) {
        const params = {
          per_page: constants.DEFAULT_PAGE_SIZE,
          page: page + 1,
        };
        const { items } = await this.listItems({
          params,
        });
        return items.map((item) => ({
          label: item.name,
          value: item.item_id,
        }));
      },
    },
    maxResults: {
      type: "integer",
      label: "Maximum Results",
      description: "The maximum number of results to return at one time.",
      optional: true,
      default: 25,
    },
  },
  methods: {
    _getBaseUrl() {
      return `${this.$auth.api_domain}/inventory/v1/`;
    },
    _getHeaders() {
      return {
        Authorization: `Zoho-oauthtoken ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest(args = {}) {
      const {
        method = "GET",
        path,
        $ = this,
        ...otherArgs
      } = args;
      const config = {
        method,
        url: `${this._getBaseUrl()}${path}`,
        headers: this._getHeaders(),
        ...otherArgs,
      };
      return axios($, config);
    },
    async listOrganizations(args = {}) {
      return this._makeRequest({
        path: "organizations",
        ...args,
      });
    },
    async listContacts(args = {}) {
      return this._makeRequest({
        path: "contacts",
        ...args,
      });
    },
    async listItems(args = {}) {
      return this._makeRequest({
        path: "items",
        ...args,
      });
    },
    async listInvoices(args = {}) {
      return this._makeRequest({
        path: "invoices",
        ...args,
      });
    },
    async listSalesOrders(args = {}) {
      return this._makeRequest({
        path: "salesorders",
        ...args,
      });
    },
    async createContact(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "contacts",
        ...args,
      });
    },
    async createSalesOrder(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "salesorders",
        ...args,
      });
    },
  },
};
