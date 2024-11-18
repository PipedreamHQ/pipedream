import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zendesk_sell",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "Identifier of a contact",
      async options({ page }) {
        const { items } = await this.listContacts({
          page: page + 1,
        });
        return items?.map(({ data }) => ({
          value: data.id,
          label: data.name || (`${data.first_name} ${data.last_name}`).trim(),
        })) || [];
      },
    },
    leadId: {
      type: "string",
      label: "Lead ID",
      description: "Identifier of a lead",
      async options({ page }) {
        const { items } = await this.listLeads({
          page: page + 1,
        });
        return items?.map(({ data }) => ({
          value: data.id,
          label: data.organization_name || (`${data.first_name} ${data.last_name}`).trim(),
        })) || [];
      },
    },
    dealId: {
      type: "string",
      label: "Deal ID",
      description: "Identifier of a deal",
      async options({ page }) {
        const { items } = await this.listDeals({
          page: page + 1,
        });
        return items?.map(({ data }) => ({
          value: data.id,
          label: data.name,
        })) || [];
      },
    },
    isOrganization: {
      type: "boolean",
      label: "Is Organization",
      description: "Indicator of whether or not this contact refers to an organization or an individual",
    },
    status: {
      type: "string",
      label: "Status",
      description: "The customer status of the contact",
      options: [
        "none",
        "current",
        "past",
      ],
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The contact’s job title",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The contact’s description",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The contact’s email address",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The contact’s phone number",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.getbase.com/v2";
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
          accept: "application/json",
        },
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },
    listLeads(opts = {}) {
      return this._makeRequest({
        path: "/leads",
        ...opts,
      });
    },
    listDeals(opts = {}) {
      return this._makeRequest({
        path: "/deals",
        ...opts,
      });
    },
    createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        ...opts,
      });
    },
    createLead(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/leads",
        ...opts,
      });
    },
    createTask(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/tasks",
        ...opts,
      });
    },
    async *paginate({
      fn,
      params,
      max,
    }) {
      params = {
        ...params,
        per_page: 100,
        page: 1,
      };
      let total, count = 0;
      do {
        const { items } = await fn({
          params,
        });
        for (const item of items) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        total = items?.length;
        params.page++;
      } while (total);
    },
  },
};
