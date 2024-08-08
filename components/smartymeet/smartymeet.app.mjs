import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "smartymeet",
  propDefinitions: {
    jobId: {
      type: "string",
      label: "Job Id",
      description: "The Id of the job.",
      async options({ page }) {
        const data = await this.listJobs({
          params: {
            pageNumber: page + 1,
          },
        });

        return data.map(({
          shardId, jobId, title: label,
        }) => ({
          label,
          value: `${shardId}:${jobId}`,
        }));
      },
    },
    talentId: {
      type: "string",
      label: "Talent Id",
      description: "The Id of the talent.",
      async options({ page }) {
        const { data } = await this.listTalents({
          params: {
            pageNumber: page + 1,
          },
        });

        return data.map(({
          id: value, attributes: { name: label },
        }) => ({
          label,
          value,
        }));
      },
    },
    candidateId: {
      type: "string",
      label: "Candidate Id",
      description: "The Id of the candidate.",
      async options({
        page, jobId,
      }) {
        const data = await this.listCandidates({
          jobId,
          params: {
            pageNumber: page + 1,
          },
        });

        return data.map(({
          shardId, contactId, firstName, lastName,
        }) => ({
          label: `${firstName} ${lastName}`,
          value: `${shardId}:${contactId}`,
        }));
      },
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
    _baseUrl() {
      return `${this.$auth.server}`;
    },
    _headers() {
      return {
        Authorization: `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        ...opts,
        url: this._baseUrl() + path,
        headers: this._headers(),
      };
      console.log("config: ", config);

      return axios($, config);
    },
    listJobs(opts = {}) {
      return this._makeRequest({
        path: "/jobs",
        ...opts,
      });
    },
    listCandidates({
      jobId, ...opts
    }) {
      return this._makeRequest({
        path: `/jobs/${jobId}/candidates`,
        ...opts,
      });
    },
    listTalents(opts = {}) {
      return this._makeRequest({
        path: "/talents",
        ...opts,
      });
    },

    emitNewCandidateAnalysisReport({
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
    createJob(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/jobs",
        ...opts,
      });
    },
    retrieveCandidateAnalysis({
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
    createCandidate(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/candidates",
        ...opts,
      });
    },
  },
};
