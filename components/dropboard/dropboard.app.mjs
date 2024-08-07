import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dropboard",
  propDefinitions: {
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The ID of the job",
      async options({ page }) {
        const { list } = await this.listJobs({
          params: {
            page: page + 1,
          },
        });

        return list.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    clientId: {
      type: "string",
      label: "Client ID",
      description: "The id of the client this job should belong to, or not set to belong to the root organization",
      async options({ page }) {
        const { list } = await this.listClients({
          params: {
            page: page + 1,
          },
        });

        return list.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    hiringManagerEmail: {
      type: "string",
      label: "Hiring Manager Email",
      description: "The email of the hiring manager",
    },
    jobDetails: {
      type: "object",
      label: "Job Details",
      description: "Details of the job",
    },
    clientName: {
      type: "string",
      label: "Client Name",
      description: "The name of the client",
    },
    clientPlanId: {
      type: "string",
      label: "Client Plan ID",
      description: "The plan ID for the client",
      async options({ page }) {
        const { list } = await this.listPlans({
          params: {
            page: page + 1,
          },
        });

        return list.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.dropboardhq.com/2024-02";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    createWebhook({
      path, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/${path}/webhooks`,
        ...opts,
      });
    },
    deleteWebhook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
      });
    },
    createJob(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/jobs",
        ...opts,
      });
    },
    createClient(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/clients",
        ...opts,
      });
    },
    listClients(opts = {}) {
      return this._makeRequest({
        path: "/clients",
        ...opts,
      });
    },
    listJobs(opts = {}) {
      return this._makeRequest({
        path: "/jobs",
        ...opts,
      });
    },
    listPlans(opts = {}) {
      return this._makeRequest({
        path: "/clients/plans",
        ...opts,
      });
    },
    async findOrCreateClient({
      clientName, ...otherOpts
    }) {
      const { list: clients } = await this._makeRequest({
        method: "GET",
        path: "/clients",
        params: {
          search: clientName,
        },
      });

      if (clients.length > 0) {
        return clients[0];
      } else {
        return this.createClient({
          data: {
            name: clientName,
            ...otherOpts,
          },
        });
      }
    },
  },
};
