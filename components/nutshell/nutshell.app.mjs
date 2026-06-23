import { axios } from "@pipedream/platform";
import {
  BASE_URL,
  ENDPOINTS,
  ENTITY_KEYS,
  PAGINATION,
} from "./common/constants.mjs";
import { formatContact as formatContactForOutput } from "./common/contact-output.mjs";
import { formatCompany as formatCompanyForOutput } from "./common/company-output.mjs";
import {
  formatLead as formatLeadForOutput,
  formatSearchLeadResult as formatSearchLeadResultFn,
} from "./common/lead-output.mjs";

export default {
  type: "app",
  app: "nutshell",
  propDefinitions: {
    companyId: {
      type: "string",
      label: "Company ID",
      description: "The company (account) ID.",
      async options({ page }) {
        const items = await this.listAccounts({
          params: {
            [PAGINATION.PAGE_PARAM]: page,
            [PAGINATION.LIMIT_PARAM]: PAGINATION.DEFAULT_LIMIT,
          },
        });
        return items.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    accountTypeId: {
      type: "string",
      label: "Account Type ID",
      description: "The account type of the company.",
      async options() {
        const items = await this.listAccountTypes({});
        return items.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    address: {
      type: "string[]",
      label: "Address",
      description: "A list of address objects. Each item is a JSON string, e.g. `{\"name\":\"HQ\",\"address_1\":\"123 Main St\",\"city\":\"Austin\",\"state\":\"TX\",\"country\":\"US\"}`.",
    },
    audienceId: {
      type: "string[]",
      label: "Audience ID",
      description: "The audience IDs.",
      async options() {
        const items = await this.listAudiences({});
        return items.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The contact ID.",
      async options({ page }) {
        const items = await this.listContacts({
          params: {
            [PAGINATION.PAGE_PARAM]: page,
            [PAGINATION.LIMIT_PARAM]: PAGINATION.DEFAULT_LIMIT,
          },
        });
        return items.map((c) => {
          const label = typeof c.name === "object"
            ? (c.name?.displayName
              || [
                c.name?.givenName,
                c.name?.familyName,
              ].filter(Boolean).join(" ")
              || c.id)
            : (c.name ?? c.id);
          return {
            label,
            value: c.id,
          };
        });
      },
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The name of the company.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description to identify the lead.",
    },
    industryId: {
      type: "string",
      label: "Industry ID",
      description: "The industry the company belongs to.",
      async options() {
        const items = await this.listIndustries({});
        return items.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    leadId: {
      type: "string",
      label: "Lead ID",
      description: "The lead's ID.",
      async options({ page }) {
        const items = await this.listLeads({
          params: {
            [PAGINATION.PAGE_PARAM]: page,
            [PAGINATION.LIMIT_PARAM]: PAGINATION.DEFAULT_LIMIT,
          },
        });
        return items.map((lead) => {
          const name = lead.name ?? lead.description ?? lead.id;
          const primaryAccount = lead.primaryAccount?.name ?? lead.primaryAccountName ?? "";
          const primaryContact = lead.primaryContact?.name ?? lead.primaryContactName ?? "";
          const context = [
            primaryAccount,
            primaryContact,
          ].filter(Boolean).join(", ");
          const label = (name && context)
            ? `${name}: ${context}`
            : (name || context || String(lead.id));
          return {
            label,
            value: lead.id,
          };
        });
      },
    },
    marketId: {
      type: "string",
      label: "Market ID",
      description: "The market's ID of the lead.",
      async options() {
        const items = await this.listMarkets({});
        return items.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    phone: {
      type: "string[]",
      label: "Phones",
      description: "The phone numbers. Each item is a JSON string, e.g. `{\"isPrimary\":true,\"value\":\"+15125551234\"}`.",
      optional: true,
    },
    territoryId: {
      type: "string",
      label: "Territory ID",
      description: "The territory of the company.",
      async options() {
        const items = await this.listTerritories({});
        return items.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    email: {
      type: "string[]",
      label: "Email",
      description: "The email addresses. Each item is a JSON string, e.g. `{\"isPrimary\":true,\"value\":\"info@acme.com\"}`.",
    },
    query: {
      type: "string",
      label: "Query",
      description: "Free-text search string mapped to the REST `q` query parameter.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of records to return (min 1, max 1000).",
      min: 1,
      max: 1000,
      optional: true,
    },
  },
  methods: {
    /**
     * Central HTTP request helper using @pipedream/platform axios.
     * HTTP Basic auth: username=email, password=api_key (unchanged from JSON-RPC auth).
     * Undefined values in data/params are stripped automatically by the platform axios.
     */
    _makeRequest({
      $ = this, path, headers, ...args
    }) {
      return axios($, {
        url: `${BASE_URL}${path}`,
        auth: {
          username: this.$auth.email,
          password: this.$auth.api_key,
        },
        headers,
        ...args,
      });
    },

    // ── Accounts (Companies) ──────────────────────────────────────────────────

    /**
     * GET /rest/accounts/{id}
     * Returns the account object. REST may return it directly or wrapped.
     */
    async getAccount({
      $, companyId,
    }) {
      const response = await this._makeRequest({
        $,
        path: `${ENDPOINTS.ACCOUNTS}/${companyId}`,
      });
      return Array.isArray(response?.[ENTITY_KEYS.ACCOUNTS])
        ? response[ENTITY_KEYS.ACCOUNTS][0]
        : response;
    },

    /**
     * GET /rest/accounts
     * Returns array of account stubs.
     */
    async listAccounts({
      $, params,
    }) {
      const response = await this._makeRequest({
        $,
        path: ENDPOINTS.ACCOUNTS,
        params,
      });
      return response?.[ENTITY_KEYS.ACCOUNTS] ?? (Array.isArray(response)
        ? response
        : []);
    },

    /**
     * POST /rest/accounts
     * Body: { accounts: [accountData] }
     * Returns the created account.
     */
    async createAccount({
      $, data,
    }) {
      const response = await this._makeRequest({
        $,
        method: "POST",
        path: ENDPOINTS.ACCOUNTS,
        data,
      });
      return Array.isArray(response?.[ENTITY_KEYS.ACCOUNTS])
        ? response[ENTITY_KEYS.ACCOUNTS][0]
        : response;
    },

    /**
     * PATCH /rest/accounts/{id} with JSON Patch array (returns 204).
     * Issues a follow-up GET to return the updated account.
     */
    async updateAccount({
      $, companyId, patches,
    }) {
      await this._makeRequest({
        $,
        method: "PATCH",
        path: `${ENDPOINTS.ACCOUNTS}/${companyId}`,
        data: patches,
        headers: {
          "Content-Type": "application/json-patch+json",
        },
      });
      return this.getAccount({
        $,
        companyId,
      });
    },

    // ── Contacts ─────────────────────────────────────────────────────────────

    /**
     * GET /rest/contacts/{id}
     */
    async getContact({
      $, contactId,
    }) {
      const response = await this._makeRequest({
        $,
        path: `${ENDPOINTS.CONTACTS}/${contactId}`,
      });
      return Array.isArray(response?.[ENTITY_KEYS.CONTACTS])
        ? response[ENTITY_KEYS.CONTACTS][0]
        : response;
    },

    /**
     * GET /rest/contacts
     * Returns array of contact stubs.
     */
    async listContacts({
      $, params,
    }) {
      const response = await this._makeRequest({
        $,
        path: ENDPOINTS.CONTACTS,
        params,
      });
      return response?.[ENTITY_KEYS.CONTACTS] ?? (Array.isArray(response)
        ? response
        : []);
    },

    /**
     * POST /rest/contacts
     * Body: { contacts: [contactData] }
     * Returns the created contact.
     */
    async createContact({
      $, data,
    }) {
      const response = await this._makeRequest({
        $,
        method: "POST",
        path: ENDPOINTS.CONTACTS,
        data,
      });
      return Array.isArray(response?.[ENTITY_KEYS.CONTACTS])
        ? response[ENTITY_KEYS.CONTACTS][0]
        : response;
    },

    /**
     * PATCH /rest/contacts/{id} with JSON Patch array (returns 204).
     * Issues a follow-up GET to return the updated contact.
     */
    async updateContact({
      $, contactId, patches,
    }) {
      await this._makeRequest({
        $,
        method: "PATCH",
        path: `${ENDPOINTS.CONTACTS}/${contactId}`,
        data: patches,
        headers: {
          "Content-Type": "application/json-patch+json",
        },
      });
      return this.getContact({
        $,
        contactId,
      });
    },

    // ── Leads ─────────────────────────────────────────────────────────────────

    /**
     * GET /rest/leads/{id}
     * status field is a STRING in REST (e.g. "open", "won", "lost").
     */
    async getLead({
      $, leadId,
    }) {
      const response = await this._makeRequest({
        $,
        path: `${ENDPOINTS.LEADS}/${leadId}`,
      });
      return Array.isArray(response?.[ENTITY_KEYS.LEADS])
        ? response[ENTITY_KEYS.LEADS][0]
        : response;
    },

    /**
     * GET /rest/leads
     * Returns array of lead stubs.
     */
    async listLeads({
      $, params,
    }) {
      const response = await this._makeRequest({
        $,
        path: ENDPOINTS.LEADS,
        params,
      });
      return response?.[ENTITY_KEYS.LEADS] ?? (Array.isArray(response)
        ? response
        : []);
    },

    /**
     * POST /rest/leads
     * Body: { leads: [leadData] }
     * Returns the created lead (status is a STRING).
     */
    async createLead({
      $, data,
    }) {
      const response = await this._makeRequest({
        $,
        method: "POST",
        path: ENDPOINTS.LEADS,
        data,
      });
      return Array.isArray(response?.[ENTITY_KEYS.LEADS])
        ? response[ENTITY_KEYS.LEADS][0]
        : response;
    },

    /**
     * PATCH /rest/leads/{id} with JSON Patch array (returns 204).
     * Issues a follow-up GET to return the updated lead.
     */
    async updateLead({
      $, leadId, patches,
    }) {
      await this._makeRequest({
        $,
        method: "PATCH",
        path: `${ENDPOINTS.LEADS}/${leadId}`,
        data: patches,
        headers: {
          "Content-Type": "application/json-patch+json",
        },
      });
      return this.getLead({
        $,
        leadId,
      });
    },

    // ── List helpers ──────────────────────────────────────────────────────────

    /**
     * GET /rest/accounttypes
     * Returns array of {id, name} pairs.
     */
    async listAccountTypes({ $ }) {
      const response = await this._makeRequest({
        $,
        path: ENDPOINTS.ACCOUNT_TYPES,
      });
      return response?.accountTypes
        ?? response?.accounttypes
        ?? (Array.isArray(response)
          ? response
          : []);
    },

    /**
     * GET /rest/industries
     * Returns array of {id, name} pairs.
     */
    async listIndustries({ $ }) {
      const response = await this._makeRequest({
        $,
        path: ENDPOINTS.INDUSTRIES,
      });
      return response?.industries ?? (Array.isArray(response)
        ? response
        : []);
    },

    /**
     * GET /rest/markets
     * The endpoint returns an object keyed by ID, so normalize to array.
     */
    async listMarkets({ $ }) {
      const response = await this._makeRequest({
        $,
        path: ENDPOINTS.MARKETS,
      });
      const raw = response?.markets ?? response ?? {};
      if (Array.isArray(raw)) {
        return raw;
      }
      return Object.entries(raw).map(([
        id,
        market,
      ]) => ({
        id,
        name: market?.name ?? market,
      }));
    },

    /**
     * GET /rest/territories
     * Returns array of {id, name} pairs.
     */
    async listTerritories({ $ }) {
      const response = await this._makeRequest({
        $,
        path: ENDPOINTS.TERRITORIES,
      });
      return response?.territories ?? (Array.isArray(response)
        ? response
        : []);
    },

    /**
     * GET /rest/audiences
     * Returns array of {id, name} pairs.
     */
    async listAudiences({ $ }) {
      const response = await this._makeRequest({
        $,
        path: ENDPOINTS.AUDIENCES,
      });
      return response?.audiences ?? (Array.isArray(response)
        ? response
        : []);
    },

    // ── Formatters ────────────────────────────────────────────────────────────

    formatContact(contact) {
      return formatContactForOutput(contact);
    },

    formatCompany(company) {
      return formatCompanyForOutput(company, formatContactForOutput);
    },

    formatLead(lead) {
      return formatLeadForOutput(lead, formatContactForOutput);
    },

    formatSearchLeadResult(lead) {
      return formatSearchLeadResultFn(lead);
    },

    /**
     * Async generator that pages through a REST list endpoint.
     * Yields items one at a time in the order returned by the API; callers pass a
     * `sort` param to control ordering.
     *
     * @param {Object} [$] - Execution context threaded to _makeRequest (defaults to the app).
     * @param {string} path - REST endpoint path (e.g. "/leads")
     * @param {string} [entityKey] - Top-level response key holding the items array
     * @param {Object} [params={}] - Extra query params (e.g. status filter)
     * @param {number} [pageSize] - Items per page (default 100)
     */
    async *paginate({
      $, path, entityKey, params = {}, pageSize = PAGINATION.DEFAULT_LIMIT,
    }) {
      let page = 0;
      let hasMore = true;

      while (hasMore) {
        const response = await this._makeRequest({
          $,
          path,
          params: {
            ...params,
            [PAGINATION.PAGE_PARAM]: page,
            [PAGINATION.LIMIT_PARAM]: pageSize,
          },
        });

        let items;
        if (entityKey && Array.isArray(response?.[entityKey])) {
          items = response[entityKey];
        } else if (Array.isArray(response)) {
          items = response;
        } else {
          // Fallback: find the first array value in the response object
          items = Object.values(response ?? {}).find((v) => Array.isArray(v)) ?? [];
        }

        for (const item of items) {
          yield item;
        }

        hasMore = items.length >= pageSize;
        page++;
      }
    },
  },
};
