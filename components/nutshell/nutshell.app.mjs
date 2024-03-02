import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "nutshell",
  propDefinitions: {
    accountId: {
      type: "string",
      label: "Account Id",
      description: "The account's Id to the Lead.",
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
        page, accountId,
      }) {
        const { result } = await this.post({
          method: "findLeads",
          data: {
            params: {
              page: page + 1,
              query: {
                accountId: parseInt(accountId),
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
