import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mautic",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      async options({ prevContext }) {
        const { start = 0 } = prevContext;
        const response = await this.listUsers({
          params: {
            start,
          },
        });
        const data = Object.values(response);
        return {
          options: data.map((d) => ({
            label: `${d.firstName} ${d.lastName}`,
            value: d.id,
          })),
          context: {
            start: start + data.length,
          },
        };
      },
    },
    campaignId: {
      type: "string",
      label: "Campaign ID",
      async options({ prevContext }) {
        const { start = 0 } = prevContext;
        const response = await this.listCampaigns({
          params: {
            start,
          },
        });
        const data = Object.values(response);
        return {
          options: data.map((d) => ({
            label: d.name,
            value: d.id,
          })),
          context: {
            start: start + data.length,
          },
        };
      },
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      async options({ prevContext }) {
        const { start = 0 } = prevContext;
        const response = await this.listContacts({
          params: {
            start,
          },
        });
        const data = Object.values(response);
        return {
          options: data.map((d) => ({
            label: `${d.fields.all.firstname} ${d.fields.all.lastname}`,
            value: d.id,
          })),
          context: {
            start: start + data.length,
          },
        };
      },
    },
    companyId: {
      type: "string",
      label: "Company ID",
      withLabel: true,
      async options({ prevContext }) {
        const { start = 0 } = prevContext;
        const response = await this.listCompanies({
          params: {
            start,
          },
        });
        const data = Object.values(response);
        return {
          options: data.map((d) => ({
            label: d.fields.all.companyname,
            value: d.fields.all.id,
          })),
          context: {
            start: start + data.length,
          },
        };
      },
    },
    formId: {
      type: "string",
      label: "Form ID",
      async options({ prevContext }) {
        const { start = 0 } = prevContext;
        const response = await this.listForms({
          params: {
            start,
          },
        });
        const data = Object.values(response);
        return {
          options: data.map((d) => ({
            label: d.name,
            value: d.id,
          })),
          context: {
            start: start + data.length,
          },
        };
      },
    },
    search: {
      type: "string",
      label: "Search Query",
      description: "String or search command to filter entities by",
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Column to sort by. Can use any column listed in the response in `snake_case`",
      optional: true,
    },
    orderByDir: {
      type: "string",
      label: "Order By Direction",
      description: "Sort direction: `ascending` or `descending`",
      optional: true,
      options: [
        "asc",
        "desc",
      ],
    },
    publishedOnly: {
      type: "boolean",
      label: "Is Published Only",
      description: "Only return currently published entities",
      optional: true,
    },
    minimal: {
      type: "boolean",
      label: "Minimal",
      description: "Return only array of entities without additional lists in it",
      optional: true,
    },
    where: {
      type: "any",
      label: "Where",
      description: "An array of advanced `where` conditions",
      optional: true,
    },
    order: {
      type: "any",
      label: "Order",
      description: "An array of advanced `order` statements",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Limit number of entities to return",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.mautic_url}/api`;
    },
    _baseHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this,
      method = "GET",
      path,
      params,
      data,
    }) {
      const url = `${this._baseUrl()}${path}`;
      const headers = this._baseHeaders();
      return axios($, {
        url,
        method,
        headers,
        params,
        data,
      });
    },
    async createWebhook({
      webhookUrl,
      secret,
      eventType,
    }) {
      const path = "/hooks/new";
      const { hook } = await this._makeRequest({
        path,
        method: "POST",
        data: {
          name: `pipedream-${webhookUrl}`,
          webhookUrl,
          secret,
          triggers: [
            eventType,
          ],
        },
      });
      return hook.id;
    },
    async deleteWebhook({ webhookId }) {
      const path = `/hooks/${webhookId}/delete`;
      const { hook } = await this._makeRequest({
        path,
        method: "DELETE",
      });
      return hook;
    },
    async *paginate({
      $,
      fn,
      maxResults,
      pathVariables,
      params,
    }) {
      let start = 0;

      while (true) {
        const response = await fn({
          $,
          ...pathVariables,
          params: {
            ...params,
            start,
          },
        });

        const data = Object.values(response);
        if (data.length === 0) return;

        for (const d of data) {
          yield d;
          if (++start >= maxResults) return;
        }
      }
    },
    async listAll(paginator) {
      const results = [];
      for await (const result of paginator) {
        results.push(result);
      }
      return results;
    },
    async listUsers({
      $,
      params,
    }) {
      const path = "/users";
      const { users } = await this._makeRequest({
        $,
        path,
        params,
      });
      return users;
    },
    async getCampaign({
      $,
      campaignId,
    }) {
      const path = `/campaigns/${campaignId}`;
      const { campaign } = await this._makeRequest({
        $,
        path,
      });
      return campaign;
    },
    async listCampaigns({
      $,
      params,
    }) {
      const path = "/campaigns";
      const { campaigns } = await this._makeRequest({
        $,
        path,
        params,
      });
      return campaigns;
    },
    async getContact({
      $,
      contactId,
    }) {
      const path = `/contacts/${contactId}`;
      const { contact } = await this._makeRequest({
        $,
        path,
      });
      return contact;
    },
    async updateContact({
      $,
      contactId,
      data,
    }) {
      const path = `/contacts/${contactId}/edit`;
      const { contact } = await this._makeRequest({
        $,
        path,
        method: "PATCH",
        data,
      });
      return contact;
    },
    async listContacts({
      $,
      params,
    }) {
      const path = "/contacts";
      const { contacts } = await this._makeRequest({
        $,
        path,
        params,
      });
      return contacts;
    },
    async listContactsFields({ $ }) {
      const path = "/contacts/list/fields";
      return this._makeRequest({
        $,
        path,
      });
    },
    async addContactToCampaign({
      $,
      campaignId,
      contactId,
    }) {
      const path = `/campaigns/${campaignId}/contact/${contactId}/add`;
      return this._makeRequest({
        $,
        path,
        method: "POST",
      });
    },
    async cloneCampaign({
      $,
      campaignId,
    }) {
      const path = `/campaigns/clone/${campaignId}`;
      const { campaign } = await this._makeRequest({
        $,
        path,
        method: "POST",
      });
      return campaign;
    },
    async createContact({
      $,
      data,
    }) {
      const path = "/contacts/new";
      const { contact } = await this._makeRequest({
        $,
        path,
        method: "POST",
        data,
      });
      return contact;
    },
    async listCompanies({
      $,
      params,
    }) {
      const path = "/companies";
      const { companies } = await this._makeRequest({
        $,
        path,
        params,
      });
      return companies;
    },
    async deleteCompany({
      $,
      companyId,
    }) {
      const path = `/companies/${companyId}/delete`;
      const { company } = await this._makeRequest({
        $,
        path,
        method: "DELETE",
      });
      return company;
    },
    async listForms({
      $,
      params,
    }) {
      const path = "/forms";
      const { forms } = await this._makeRequest({
        $,
        path,
        params,
      });
      return forms;
    },
    async listFormSubmissions({
      $,
      formId,
      params,
    }) {
      const path = `/forms/${formId}/submissions`;
      const { submissions } = await this._makeRequest({
        $,
        path,
        params,
      });
      return submissions;
    },
  },
};
