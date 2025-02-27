import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "gem",
  version: "0.0.{{ts}}",
  propDefinitions: {
    // Emit New Candidate Event Props
    filterJobPositions: {
      type: "string[]",
      label: "Job Positions Filter",
      description: "Filter events by specific job positions",
      optional: true,
      async options() {
        const positions = await this.listJobPositions();
        return positions.map((position) => ({
          label: position.name,
          value: position.id,
        }));
      },
    },
    filterRecruiters: {
      type: "string[]",
      label: "Recruiters Filter",
      description: "Filter events by specific recruiters",
      optional: true,
      async options() {
        const recruiters = await this.listRecruiters();
        return recruiters.map((recruiter) => ({
          label: recruiter.name,
          value: recruiter.id,
        }));
      },
    },

    // Emit Candidate Stage Change Event Props
    monitorPipelines: {
      type: "string[]",
      label: "Pipelines to Monitor",
      description: "Specify which pipelines to monitor for stage changes",
      optional: true,
      async options() {
        const pipelines = await this.listPipelines();
        return pipelines.map((pipeline) => ({
          label: pipeline.name,
          value: pipeline.id,
        }));
      },
    },
    monitorStages: {
      type: "string[]",
      label: "Stages to Monitor",
      description: "Specify which stages to monitor for stage changes",
      optional: true,
      async options({ monitorPipelines }) {
        if (!monitorPipelines || monitorPipelines.length === 0) return [];
        const stages = await this.listStages({
          pipelineIds: monitorPipelines,
        });
        return stages.map((stage) => ({
          label: stage.name,
          value: stage.id,
        }));
      },
    },

    // Create Candidate Props
    firstName: {
      type: "string",
      label: "First Name",
      description: "Candidate's first name",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Candidate's last name",
    },
    emails: {
      type: "string[]",
      label: "Email Addresses",
      description: "List of candidate's email addresses",
    },
    jobPosition: {
      type: "string",
      label: "Job Position",
      description: "The position the candidate is applying for",
      optional: true,
      async options() {
        const positions = await this.listJobPositions();
        return positions.map((position) => ({
          label: position.name,
          value: position.id,
        }));
      },
    },
    source: {
      type: "string",
      label: "Source",
      description: "Source of the candidate",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Additional notes about the candidate",
      optional: true,
    },

    // Update Candidate Stage Props
    candidateId: {
      type: "string",
      label: "Candidate ID",
      description: "The ID of the candidate to update",
    },
    newStage: {
      type: "string",
      label: "New Stage",
      description: "The new stage for the candidate",
      async options({ monitorPipelines }) {
        if (!monitorPipelines || monitorPipelines.length === 0) return [];
        const stages = await this.listStages({
          pipelineIds: monitorPipelines,
        });
        return stages.map((stage) => ({
          label: stage.name,
          value: stage.id,
        }));
      },
    },
    changeNote: {
      type: "string",
      label: "Change Note",
      description: "Optional note or reason for stage change",
      optional: true,
    },
  },
  methods: {
    // Log Authentication Keys
    authKeys() {
      console.log(Object.keys(this.$auth));
    },

    // Base URL Method
    _baseUrl() {
      return "https://api.gem.com/v0";
    },

    // Make Request Method
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
        ...otherOpts,
      });
    },

    // Pagination Method
    async paginate(fn, ...opts) {
      const results = [];
      let page = 1;
      let more = true;
      while (more) {
        const response = await fn({
          page,
          ...opts,
        });
        if (!response || response.length === 0) {
          more = false;
        } else {
          results.push(...response);
          page += 1;
        }
      }
      return results;
    },

    // List Job Positions
    async listJobPositions(opts = {}) {
      return this.paginate(this.listJobPositionsPage, opts);
    },
    async listJobPositionsPage({
      page, ...opts
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/job_positions?page=${page}`,
        ...opts,
      });
    },

    // List Recruiters
    async listRecruiters(opts = {}) {
      return this.paginate(this.listRecruitersPage, opts);
    },
    async listRecruitersPage({
      page, ...opts
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/recruiters?page=${page}`,
        ...opts,
      });
    },

    // List Pipelines
    async listPipelines(opts = {}) {
      return this.paginate(this.listPipelinesPage, opts);
    },
    async listPipelinesPage({
      page, ...opts
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/pipelines?page=${page}`,
        ...opts,
      });
    },

    // List Stages
    async listStages({
      pipelineIds = [], ...opts
    }) {
      if (pipelineIds.length === 0) return [];
      const stagePromises = pipelineIds.map((pipelineId) =>
        this.paginate(this.listStagesPage, {
          pipelineId,
          ...opts,
        }));
      const stagesArrays = await Promise.all(stagePromises);
      return stagesArrays.flat();
    },
    async listStagesPage({
      pipelineId, page, ...opts
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/pipelines/${pipelineId}/stages?page=${page}`,
        ...opts,
      });
    },

    // Create a New Candidate
    async createCandidate({
      firstName, lastName, emails, jobPosition, source, notes,
    }) {
      const data = {
        first_name: firstName,
        last_name: lastName,
        emails: emails.map((email) => ({
          email_address: email,
          is_primary: false,
        })),
      };
      if (jobPosition) data.title = jobPosition;
      if (source) data.sourced_from = source;
      if (notes) data.notes = notes;
      return this._makeRequest({
        method: "POST",
        path: "/candidates",
        data,
      });
    },

    // Update Candidate Stage
    async updateCandidateStage({
      candidateId, newStage, changeNote,
    }) {
      const data = {
        stage: newStage,
      };
      if (changeNote) data.notes = changeNote;
      return this._makeRequest({
        method: "PUT",
        path: `/candidates/${candidateId}`,
        data,
      });
    },
  },
};
