import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dropboard",
  propDefinitions: {
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The ID of the job",
      optional: true,
    },
    clientId: {
      type: "string",
      label: "Client ID",
      description: "The ID of the client",
      optional: true,
    },
    hiringManagerEmail: {
      type: "string",
      label: "Hiring Manager Email",
      description: "The email of the hiring manager",
      optional: true,
    },
    jobDetails: {
      type: "object",
      label: "Job Details",
      description: "Details of the job",
      required: true,
    },
    clientName: {
      type: "string",
      label: "Client Name",
      description: "The name of the client",
      required: true,
    },
    clientPlanId: {
      type: "string",
      label: "Client Plan ID",
      description: "The plan ID for the client",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the job",
      required: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the job",
      required: true,
    },
    hiringManagerEmails: {
      type: "string[]",
      label: "Hiring Manager Emails",
      description: "The emails of the hiring managers",
      required: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the job",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "The location of the job",
      optional: true,
    },
    qualifications: {
      type: "string",
      label: "Qualifications",
      description: "The qualifications required for the job",
      optional: true,
    },
    responsibilities: {
      type: "string",
      label: "Responsibilities",
      description: "The responsibilities of the job",
      optional: true,
    },
    compensation: {
      type: "string",
      label: "Compensation",
      description: "The compensation for the job",
      optional: true,
    },
    openDateStart: {
      type: "string",
      label: "Open Date Start",
      description: "The start date for the job opening",
      optional: true,
    },
    openDateEnd: {
      type: "string",
      label: "Open Date End",
      description: "The end date for the job opening",
      optional: true,
    },
    jobCode: {
      type: "string",
      label: "Job Code",
      description: "The code for the job",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.dropboardhq.com/2024-02";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createCandidateWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/candidates/webhooks",
        ...opts,
      });
    },
    async createMemberWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/clients/members/webhooks",
        ...opts,
      });
    },
    async createJobWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/jobs/webhooks",
        ...opts,
      });
    },
    async createJob(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/jobs",
        ...opts,
      });
    },
    async createClient(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/clients",
        ...opts,
      });
    },
    async findOrCreateClient(opts = {}) {
      const {
        clientName, ...otherOpts
      } = opts;
      const clients = await this._makeRequest({
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
