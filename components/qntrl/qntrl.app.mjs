import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "qntrl",
  propDefinitions: {
    orgId: {
      type: "string",
      label: "Organization ID",
      description: "Select an organization, or provide a custom organization ID.",
      async options() {
        const orgs = await this.listOrganizations();
        return orgs?.map((org) => ({
          label: org.org_domain,
          value: org.org_id,
        }));
      },
    },
    formId: {
      type: "string",
      label: "Form ID",
      description: "Select a form (layout), or provide a custom form ID.",
      async options({ orgId }) {
        const forms = await this.listForms(orgId);
        return forms?.map((form) => ({
          label: form.layout_name,
          value: form.layout_id,
        }));
      },
    },
    jobId: {
      type: "string",
      label: "Job ID",
      description: "Select a job (card), or provide a custom job ID.",
      async options({ orgId }) {
        const jobs = await this.listJobs(orgId);
        return jobs?.map((job) => ({
          label: job.title,
          value: job.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://coreapi.qntrl.com/blueprint/api";
    },
    async _makeRequest({
      $ = this,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        baseURL: this._baseUrl(),
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async listOrganizations() {
      return this._makeRequest({
        url: "/org",
      });
    },
    async listForms(orgId) {
      return this._makeRequest({
        url: `/${orgId}/layout`,
      });
    },
    async listJobs(orgId) {
      const response = await this._makeRequest({
        url: `/${orgId}/job`,
      });
      return response.job_list;
    },
    async listJobComments({
      orgId, jobId,
    }) {
      const { data } = await this._makeRequest({
        url: `/${orgId}/job/${jobId}/comment`,
      });
      return data;
    },
    async getFormDetails({
      orgId, formId,
    }) {
      return this._makeRequest({
        url: `/${orgId}/layout/${formId}`,
      });
    },
    async createJob({
      orgId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/${orgId}/job`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        ...args,
      });
    },
    async postComment({
      orgId, jobId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/${orgId}/job/${jobId}/comment`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        ...args,
      });
    },
  },
};
