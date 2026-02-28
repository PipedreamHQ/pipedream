import { axios } from "@pipedream/platform";
import { formatContact as formatContactForOutput } from "./common/contact-output.mjs";
import { formatCompany as formatCompanyForOutput } from "./common/company-output.mjs";
import {
  formatLead as formatLeadForOutput, formatSearchLeadResult,
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
        const { result } = await this.post({
          method: "findAccounts",
          data: {
            params: {
              page: page + 1,
              orderBy: "name",
            },
          },
        });

        return result.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    accountTypeId: {
      type: "string",
      label: "Account Type Id",
      description: "The account type the company.",
      async options({ page }) {
        const { result } = await this.post({
          method: "findAccountTypes",
          data: {
            params: {
              page: page + 1,
              orderBy: "name",
            },
          },
        });

        return result.map(({
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
      description: "A list of address objects. E.g. `{\"address_1\":\"100 Second St.\",\"address_2\":\"Apt. 4\",\"address_3\":\"c/o Barclay Fowler\",\"city\":\"Ann Arbor\",\"state\":\"MI\",\"postalCode\": \"48103\",\"country\": \"US\"}`",
    },
    audienceId: {
      type: "string[]",
      label: "Audience Id",
      description: "The audience's Id to the Contact.",
      async options({ page }) {
        const { result } = await this.post({
          method: "findAudiences",
          data: {
            params: {
              page: page + 1,
            },
          },
        });

        return result.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    contactId: {
      type: "string",
      label: "Contact Id",
      description: "The contact's Id to the lead.",
      async options({ page }) {
        const { result } = await this.post({
          method: "findContacts",
          data: {
            params: {
              page: page + 1,
              orderBy: "name",
            },
          },
        });

        return result.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
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
      description: "A description to identify the new lead.",
    },
    industryId: {
      type: "string",
      label: "Industry Id",
      description: "The industry the company belongs to.",
      async options({ page }) {
        const { result } = await this.post({
          method: "findIndustries",
          data: {
            params: {
              page: page + 1,
              orderBy: "name",
            },
          },
        });

        return result.map(({
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
        const { result } = await this.post({
          method: "findLeads",
          data: {
            params: {
              page: page + 1,
              query: {
                filter: 2,
              },
            },
          },
        });

        return result.map((item) => {
          const value = item.id;
          const name = item.name ?? "";
          const primaryAccountName = item.primaryAccountName ?? item.primaryAccount?.name ?? "";
          const primaryContactName = item.primaryContactName ?? item.primaryContact?.name ?? "";
          const accountAndContact = [
            primaryAccountName,
            primaryContactName,
          ].filter(Boolean).join(", ");
          const label = (name && accountAndContact)
            ? `${name}: ${accountAndContact}`
            : (name || accountAndContact || String(value));
          return {
            label,
            value,
          };
        });
      },
    },
    marketId: {
      type: "string",
      label: "Market Id",
      description: "The market's Id of the lead.",
      async options({ page }) {
        const { result } = await this.post({
          method: "findMarkets",
          data: {
            params: {
              page: page + 1,
            },
          },
        });

        return result.map(({
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
      description: "The phone numbers of the company.",
      optional: true,
    },
    territoryId: {
      type: "string",
      label: "Territory Id",
      description: "The territory of the company.",
      async options({ page }) {
        const { result } = await this.post({
          method: "findTerritories",
          data: {
            params: {
              page: page + 1,
            },
          },
        });

        return result.map(({
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
      description: "The email address of the company.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the person.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the person.",
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "The job title of the person.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.api_url}/api/v1/json`;
    },
    _auth() {
      return {
        username: this.$auth.email,
        password: this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, data = {}, ...opts
    }) {
      return axios($, {
        url: this._baseUrl(),
        auth: this._auth(),
        data: {
          ...data,
          jsonrpc: "2.0",
          id: this.$auth.id,
        },
        ...opts,
      });
    },
    /**
     * Send a JSON-RPC POST request to the Nutshell API.
     *
     * @param {Object} opts - Request options
     * @param {string} opts.method - The RPC method name (e.g. getLead, findLeads)
     * @param {Object} [opts.data={}] - Additional request payload (e.g. params)
     * @param {Object} [opts.$=this] - Pipedream context for the request
     * @returns {Promise<Object>} The API response
     */
    post({
      method, data, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        data: {
          ...data,
          method,
        },
        ...opts,
      });
    },
    /**
     * Get a company (account) by ID.
     *
     * @param {Object} opts - Options
     * @param {Object} [opts.$=this] - Pipedream context
     * @param {string} opts.companyId - The company (account) ID
     * @returns {Promise<Object>} The account object
     */
    async getAccount({
      $ = this, companyId,
    }) {
      const { result } = await this.post({
        $,
        method: "getAccount",
        data: {
          params: {
            accountId: parseInt(companyId, 10),
          },
        },
      });
      return result;
    },
    /**
     * Get a contact by ID.
     *
     * @param {Object} opts - Options
     * @param {Object} [opts.$=this] - Pipedream context
     * @param {string} opts.contactId - The contact ID
     * @returns {Promise<Object>} The contact object
     */
    async getContact({
      $ = this, contactId,
    }) {
      const { result } = await this.post({
        $,
        method: "getContact",
        data: {
          params: {
            contactId: parseInt(contactId, 10),
          },
        },
      });
      return result;
    },
    /**
     * Search contacts by string (matches names, emails, etc.).
     *
     * @param {Object} opts - Options
     * @param {Object} [opts.$=this] - Pipedream context
     * @param {string} opts.string - Search string
     * @param {number} [opts.limit=1000] - Maximum number of results
     * @returns {Promise<Array>} Array of contact stubs
     */
    async searchContacts({
      $ = this, string, limit = 1000,
    }) {
      const { result } = await this.post({
        $,
        method: "searchContacts",
        data: {
          params: {
            string,
            limit: limit ?? 1000,
          },
        },
      });
      return result ?? [];
    },
    /**
     * Search companies (accounts) by string (matches company names, etc.).
     *
     * @param {Object} opts - Options
     * @param {Object} [opts.$=this] - Pipedream context
     * @param {string} opts.string - Search string
     * @param {number} [opts.limit=1000] - Maximum number of results
     * @returns {Promise<Array>} Array of account stubs
     */
    async searchCompanies({
      $ = this, string, limit = 1000,
    }) {
      const { result } = await this.post({
        $,
        method: "searchAccounts",
        data: {
          params: {
            string,
            limit: limit ?? 1000,
          },
        },
      });
      return result ?? [];
    },
    /**
     * Search leads by string (matches lead names, descriptions, etc.).
     *
     * @param {Object} opts - Options
     * @param {Object} [opts.$=this] - Pipedream context
     * @param {string} opts.string - Search string
     * @param {number} [opts.limit=1000] - Maximum number of results
     * @returns {Promise<Array>} Array of formatted lead results
     */
    async searchLeads({
      $ = this, string, limit = 1000,
    }) {
      const { result } = await this.post({
        $,
        method: "searchLeads",
        data: {
          params: {
            string,
            limit: limit ?? 1000,
          },
        },
      });
      return (result ?? []).map(formatSearchLeadResult);
    },
    /**
     * Get a lead by ID.
     *
     * @param {Object} opts - Options
     * @param {Object} [opts.$=this] - Pipedream context
     * @param {string} opts.leadId - The lead ID
     * @returns {Promise<Object|null>} The lead object or null
     */
    async getLead({
      $ = this, leadId,
    }) {
      const { result } = await this.post({
        $,
        method: "getLead",
        data: {
          params: {
            leadId: parseInt(leadId, 10),
          },
        },
      });
      return result;
    },
    /**
     * Update an existing contact.
     *
     * @param {Object} opts - Options
     * @param {Object} [opts.$=this] - Pipedream context
     * @param {string} opts.contactId - The contact ID to update
     * @param {string|null} [opts.rev=null] - Revision for optimistic locking
     * @param {Object} opts.contact - Contact fields to update
     * @returns {Promise<Object>} The updated contact
     */
    async editContact({
      $ = this, contactId, rev, contact,
    }) {
      const { result } = await this.post({
        $,
        method: "editContact",
        data: {
          params: {
            contactId: parseInt(contactId, 10),
            rev: rev ?? null,
            contact,
          },
        },
      });
      return result;
    },
    /**
     * Update an existing company (account).
     *
     * @param {Object} opts - Options
     * @param {Object} [opts.$=this] - Pipedream context
     * @param {string} opts.companyId - The company (account) ID to update
     * @param {string|null} [opts.rev=null] - Revision for optimistic locking
     * @param {Object} opts.account - Account fields to update
     * @returns {Promise<Object>} The updated account
     */
    async editAccount({
      $ = this, companyId, rev, account,
    }) {
      const { result } = await this.post({
        $,
        method: "editAccount",
        data: {
          params: {
            accountId: parseInt(companyId, 10),
            rev: rev ?? null,
            account,
          },
        },
      });
      return result;
    },
    /**
     * Update an existing lead.
     *
     * @param {Object} opts - Options
     * @param {Object} [opts.$=this] - Pipedream context
     * @param {string} opts.leadId - The lead ID to update
     * @param {string|null} [opts.rev=null] - Revision for optimistic locking
     * @param {Object} opts.lead - Lead fields to update
     * @returns {Promise<Object>} The updated lead
     */
    async editLead({
      $ = this, leadId, rev, lead,
    }) {
      const { result } = await this.post({
        $,
        method: "editLead",
        data: {
          params: {
            leadId: parseInt(leadId, 10),
            rev: rev ?? null,
            lead,
          },
        },
      });
      return result;
    },
    /**
     * Format a contact for component output (id, name, emails, phones, etc.).
     *
     * @param {Object} contact - Raw contact from the API
     * @returns {Object} Formatted contact object
     */
    formatContact(contact) {
      return formatContactForOutput(contact);
    },
    /**
     * Format a company (account) for component output, including nested contacts.
     *
     * @param {Object} company - Raw account from the API
     * @param {Function} [formatContact=formatContactForOutput] - Contact formatter
     * @returns {Object} Formatted company object
     */
    formatCompany(company) {
      return formatCompanyForOutput(company, formatContactForOutput);
    },
    /**
     * Format a lead for component output (id, description, status, primary company/contact, etc.).
     *
     * @param {Object} lead - Raw lead from the API
     * @param {Function} [formatContact=formatContactForOutput] - Contact formatter
     * @returns {Object} Formatted lead object
     */
    formatLead(lead) {
      return formatLeadForOutput(lead, formatContactForOutput);
    },
    /**
     * Get a lead by its display number (e.g. 1000 for Lead-1000).
     *
     * @param {Object} opts - Options
     * @param {Object} [opts.$=this] - Pipedream context
     * @param {string} opts.leadNumber - The lead number shown in the Nutshell UI
     * @returns {Promise<Object|null>} The lead object or null
     */
    async getLeadByNumber({
      $ = this, leadNumber,
    }) {
      const { result } = await this.post({
        $,
        method: "findLeads",
        data: {
          params: {
            query: {
              number: parseInt(leadNumber, 10),
            },
            page: 1,
            limit: 1,
            stubResponses: false,
          },
        },
      });
      return result?.[0] ?? null;
    },
    /**
     * Paginate through a find* RPC method (e.g. findLeads, findContacts).
     * Yields items page by page in descending ID order.
     *
     * @param {Object} opts - Options
     * @param {string} opts.method - The RPC method name (e.g. findLeads)
     * @param {Object} [opts.query={}] - Query params for the find method
     * @yields {Object} Each item from the result set
     */
    async *paginate({
      method, query,
    }) {
      let hasMore = false;
      let page = 0;

      do {
        const { result } = await this.post({
          method,
          data: {
            params: {
              query,
              page: ++page,
              orderBy: "id",
              orderDirection: "DESC",
            },
          },
        });

        for (const d of result) {
          yield d;
        }

        hasMore = result.length;
      } while (hasMore);
    },
  },
};
