import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "smartymeet",
  propDefinitions: {
    candidateId: {
      type: "string",
      label: "Candidate ID",
      description: "The ID of the candidate",
    },
    reportType: {
      type: "string",
      label: "Report Type",
      description: "The type of report",
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "The title of the job",
    },
    jobDescription: {
      type: "string",
      label: "Job Description",
      description: "The description of the job",
    },
    jobLocation: {
      type: "string",
      label: "Job Location",
      description: "The location of the job",
      optional: true,
    },
    jobSalary: {
      type: "string",
      label: "Job Salary",
      description: "The salary for the job",
      optional: true,
    },
    analysisType: {
      type: "string",
      label: "Analysis Type",
      description: "The type of analysis",
      optional: true,
    },
    candidateName: {
      type: "string",
      label: "Candidate Name",
      description: "The name of the candidate",
    },
    candidateContacts: {
      type: "string",
      label: "Candidate Contacts",
      description: "The contacts of the candidate",
    },
    candidateLinks: {
      type: "string",
      label: "Candidate Links",
      description: "Links related to the candidate",
      optional: true,
    },
    candidateResume: {
      type: "string",
      label: "Candidate Resume",
      description: "The resume of the candidate",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.smartymeet.com";
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
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async emitNewCandidateAnalysisReport({
      candidateId, reportType,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/candidates/${candidateId}/reports`,
        data: {
          reportType,
        },
      });
    },
    async generateNewJob({
      jobTitle, jobDescription, jobLocation, jobSalary,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/jobs",
        data: {
          jobTitle,
          jobDescription,
          jobLocation,
          jobSalary,
        },
      });
    },
    async retrieveCandidateAnalysis({
      candidateId, analysisType,
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/candidates/${candidateId}/analysis`,
        params: {
          analysisType,
        },
      });
    },
    async createNewCandidateProfile({
      candidateName,
      candidateContacts,
      candidateLinks,
      candidateResume,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/candidates",
        data: {
          candidateName,
          candidateContacts,
          candidateLinks,
          candidateResume,
        },
      });
    },
  },
};
