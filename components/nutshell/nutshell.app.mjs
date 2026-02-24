import { axios } from "@pipedream/platform";

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
      description: "The aduence's Id to the Contact.",
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
      type: "string[]",
      label: "Lead Id",
      description: "The lead's Id of the contact.",
      async options({
        page, companyId,
      }) {
        const { result } = await this.post({
          method: "findLeads",
          data: {
            params: {
              page: page + 1,
              query: {
                accountId: parseInt(companyId),
              },
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
