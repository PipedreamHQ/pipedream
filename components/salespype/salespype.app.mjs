import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "salespype",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The unique identifier of the contact",
      async options({ page }) {
        const { contacts } = await this.listContacts({
          params: {
            page: page + 1,
          },
        });
        return contacts?.map(({
          id: value, fullName: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The unique identifier of the campaign",
      async options({ page }) {
        const { campaigns } = await this.listCampaigns({
          params: {
            page: page + 1,
          },
        });
        return campaigns?.map(({
          id: value, title: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    taskTypeId: {
      type: "string",
      label: "Task Type ID",
      description: "The unique identifier of the task type",
      async options() {
        const { taskTypes } = await this.listTaskTypes();
        return taskTypes?.map(({
          id: value, task: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.pypepro.io/crm/v1";
    },
    _makeRequest({
      $ = this,
      path,
      ...otherOpts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          apikey: this.$auth.api_token,
        },
        ...otherOpts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts/list",
        ...opts,
      });
    },
    listCampaigns(opts = {}) {
      return this._makeRequest({
        path: "/campaigns",
        ...opts,
      });
    },
    listTaskTypes(opts = {}) {
      return this._makeRequest({
        path: "/tasks/types",
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
    addContactToCampaign({
      campaignId, contactId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/campaigns/${campaignId}/contacts/${contactId}`,
        ...opts,
      });
    },
    createTask({
      contactId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/tasks/contacts/${contactId}`,
        ...opts,
      });
    },
    async *paginate({
      fn, params, resourceKey, max,
    }) {
      params = {
        ...params,
        page: 0,
      };
      let totalPages, count = 0;
      do {
        params.page++;
        const results = await fn({
          params,
        });
        const items = results[resourceKey];
        for (const item of items) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        totalPages = results.totalPages;
      } while (params.page < totalPages);
    },
  },
};
