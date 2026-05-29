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
    groupId: {
      type: "string",
      label: "Item Group",
      description: "The item group to which this item belongs.",
      optional: true,
      async options({ page }) {
        const params = {
          per_page: constants.DEFAULT_PAGE_SIZE,
          page: page + 1,
        };
        const { itemgroups } = await this.listItemGroups({
          params,
        });
        return (itemgroups ?? []).map((group) => ({
          label: group.group_name,
          value: group.group_id,
        }));
      },
    },
    taxId: {
      type: "string",
      label: "Tax",
      description: "The tax to associate with the item.",
      optional: true,
      async options({ page }) {
        const params = {
          per_page: constants.DEFAULT_PAGE_SIZE,
          page: page + 1,
        };
        const { taxes } = await this.listTaxes({
          params,
        });
        return (taxes ?? []).map((tax) => ({
          label: tax.tax_name,
          value: tax.tax_id,
        }));
      },
    },
    accountId: {
      type: "string",
      label: "Account",
      description: "Select an account.",
      optional: true,
      async options({ page }) {
        const params = {
          per_page: constants.DEFAULT_PAGE_SIZE,
          page: page + 1,
        };
        const { chartofaccounts } = await this.listAccounts({
          params,
        });
        return (chartofaccounts ?? []).map((account) => ({
          label: account.account_name,
          value: account.account_id,
        }));
      },
    },
    vendorId: {
      type: "string",
      label: "Vendor",
      description: "The preferred vendor for purchasing this item.",
      optional: true,
      async options({ page }) {
        const params = {
          per_page: constants.DEFAULT_PAGE_SIZE,
          page: page + 1,
        };
        const { contacts } = await this.listContacts({
          params,
        });
        return (contacts ?? [])
          .filter((contact) => contact.contact_type === "vendor")
          .map((contact) => ({
            label: contact.contact_name,
            value: contact.contact_id,
          }));
      },
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
    async createItem(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "items",
        ...args,
      });
    },
    async listItemGroups(args = {}) {
      return this._makeRequest({
        path: "itemgroups",
        ...args,
      });
    },
    async listTaxes(args = {}) {
      return this._makeRequest({
        path: "settings/taxes",
        ...args,
      });
    },
    async listAccounts(args = {}) {
      return this._makeRequest({
        path: "chartofaccounts",
        ...args,
      });
    },
  },
};
