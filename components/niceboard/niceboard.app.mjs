import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "niceboard",
  propDefinitions: {
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The ID of the job",
    },
    applicantId: {
      type: "string",
      label: "Applicant ID",
      description: "The ID of the applicant",
    },
    applicantDetails: {
      type: "object",
      label: "Applicant Details",
      description: "Details about the applicant",
      optional: true,
    },
    jobDetails: {
      type: "object",
      label: "Job Details",
      description: "Details about the job",
      optional: true,
    },
    employerId: {
      type: "string",
      label: "Employer ID",
      description: "The ID of the employer",
    },
    employerDetails: {
      type: "object",
      label: "Employer Details",
      description: "Details about the employer",
      optional: true,
    },
    jobSeekerId: {
      type: "string",
      label: "Job Seeker ID",
      description: "The ID of the job seeker",
    },
    jobSeekerDetails: {
      type: "object",
      label: "Job Seeker Details",
      description: "Details about the job seeker",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the job posting",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the job posting",
    },
    category: {
      type: "string",
      label: "Category",
      description: "The category of the job posting",
    },
    company: {
      type: "string",
      label: "Company",
      description: "The company of the job posting",
    },
    jobType: {
      type: "string",
      label: "Job Type",
      description: "The type of the job posting",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "The location of the job posting",
      optional: true,
    },
    salaryRange: {
      type: "string",
      label: "Salary Range",
      description: "The salary range of the job posting",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the job category",
    },
    keywords: {
      type: "string[]",
      label: "Keywords",
      description: "The keywords for the job alert",
    },
    frequency: {
      type: "string",
      label: "Frequency",
      description: "The frequency of the job alert",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.niceboard.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async getJobs(opts = {}) {
      return this._makeRequest({
        path: "/jobs",
        ...opts,
      });
    },
    async getApplicants(opts = {}) {
      return this._makeRequest({
        path: "/applicants",
        ...opts,
      });
    },
    async getEmployers(opts = {}) {
      return this._makeRequest({
        path: "/employers",
        ...opts,
      });
    },
    async getJobSeekers(opts = {}) {
      return this._makeRequest({
        path: "/jobseekers",
        ...opts,
      });
    },
    async postJob(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/jobs",
        ...opts,
      });
    },
    async postCategory(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/categories",
        ...opts,
      });
    },
    async createJobAlert(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/alerts",
        ...opts,
      });
    },
  },
};
