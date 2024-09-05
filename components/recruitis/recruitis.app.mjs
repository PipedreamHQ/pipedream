import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "recruitis",
  propDefinitions: {
    title: {
      type: "string",
      label: "Title",
      description: "Title of the job",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the job",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Applicant's name",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Applicant's email address",
    },
    skype: {
      type: "string",
      label: "Skype",
      description: "Applicant's Skype link",
      optional: true,
    },
    linkedin: {
      type: "string",
      label: "LinkedIn",
      description: "Applicant's LinkedIn link",
      optional: true,
    },
    facebook: {
      type: "string",
      label: "Facebook",
      description: "Applicant's Facebook link",
      optional: true,
    },
    twitter: {
      type: "string",
      label: "Twitter",
      description: "Applicant's Twitter link",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Applicant's phone number",
      optional: true,
    },
    gdprAgreement: {
      type: "boolean",
      label: "GDPR Agreement",
      description: "Indicates whether the applicant has agreed to GDPR terms",
    },
    jobID: {
      type: "string",
      label: "Job ID",
      description: "ID of the job",
      async options() {
        const response = await this.getJobs();

        return response?.payload?.map(({
          job_id, title,
        }) => ({
          value: job_id,
          label: title,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.recruitis.io/api2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async getJobs(args = {}) {
      return this._makeRequest({
        path: "/jobs",
        ...args,
      });
    },
    async createAnswer(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/answers",
        ...args,
      });
    },
    async createJob(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/jobs",
        ...args,
      });
    },
    async createCandidate(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/candidates",
        ...args,
      });
    },
  },
};
