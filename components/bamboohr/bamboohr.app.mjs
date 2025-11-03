import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "bamboohr",
  propDefinitions: {
    applicationId: {
      type: "string",
      label: "Application ID",
      description: "The ID of an application",
      async options({ page }) {
        const { applications } = await this.listApplications({
          params: {
            page: page + 1,
          },
        });
        return applications?.map((application) => ({
          label: `${application.applicant.firstName} ${application.applicant.lastName}`,
          value: application.id,
        })) || [];
      },
    },
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The ID of a job",
      optional: true,
      async options() {
        const jobs = await this.listJobs();
        return jobs?.map((job) => ({
          label: job.title.label,
          value: job.id,
        })) || [];
      },
    },
    statusId: {
      type: "string",
      label: "Status ID",
      description: "The ID of a job status",
      async options() {
        const statuses = await this.listStatuses();
        return statuses?.map((status) => ({
          label: status.name,
          value: status.id,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://api.bamboohr.com/api/gateway.php/${this.$auth.company_domain}/v1`;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        auth: {
          username: `${this.$auth.api_key}`,
          password: "x",
        },
        ...opts,
      });
    },
    getApplication({
      applicationId, ...opts
    }) {
      return this._makeRequest({
        path: `/applicant_tracking/applications/${applicationId}`,
        ...opts,
      });
    },
    listApplications(opts = {}) {
      return this._makeRequest({
        path: "/applicant_tracking/applications",
        ...opts,
      });
    },
    listJobs(opts = {}) {
      return this._makeRequest({
        path: "/applicant_tracking/jobs",
        ...opts,
      });
    },
    listStatuses(opts = {}) {
      return this._makeRequest({
        path: "/applicant_tracking/statuses",
        ...opts,
      });
    },
    addApplicationComment({
      applicationId, ...opts
    }) {
      return this._makeRequest({
        path: `/applicant_tracking/applications/${applicationId}/comments`,
        method: "POST",
        ...opts,
      });
    },
    updateApplicationStatus({
      applicationId, ...opts
    }) {
      return this._makeRequest({
        path: `/applicant_tracking/applications/${applicationId}/status`,
        method: "POST",
        ...opts,
      });
    },
    downloadFile({
      fileId, ...opts
    }) {
      return this._makeRequest({
        path: `/files/${fileId}`,
        responseType: "arraybuffer",
        ...opts,
      });
    },
  },
};
