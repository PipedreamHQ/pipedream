import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "taleez",
  version: "0.0.{{ts}}",
  propDefinitions: {
    jobListingId: {
      type: "string",
      label: "Job Listing ID",
      description: "The ID of the job listing",
      async options() {
        const jobListings = await this.listJobListings();
        return jobListings.map((job) => ({
          label: job.title,
          value: job.id,
        }));
      },
    },
    departmentFilter: {
      type: "string",
      label: "Department Filter",
      description: "Filter job listings by department",
      optional: true,
      async options() {
        const departments = await this.getDepartments();
        return departments.map((dept) => ({
          label: dept.name,
          value: dept.id,
        }));
      },
    },
    locationFilter: {
      type: "string",
      label: "Location Filter",
      description: "Filter job listings by location",
      optional: true,
      async options() {
        const locations = await this.getLocations();
        return locations.map((loc) => ({
          label: loc.name,
          value: loc.id,
        }));
      },
    },
    candidateName: {
      type: "string",
      label: "Candidate Name",
      description: "Name of the candidate",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the candidate",
    },
    resume: {
      type: "string",
      label: "Resume",
      description: "URL or attachment of the candidate's resume",
      optional: true,
    },
    coverLetter: {
      type: "string",
      label: "Cover Letter",
      description: "URL or attachment of the candidate's cover letter",
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "Title of the job listing",
    },
    department: {
      type: "string",
      label: "Department",
      description: "The department for the job listing",
      async options() {
        const departments = await this.getDepartments();
        return departments.map((dept) => ({
          label: dept.name,
          value: dept.id,
        }));
      },
    },
    jobDescription: {
      type: "string",
      label: "Job Description",
      description: "Description of the job listing",
    },
    jobLocation: {
      type: "string",
      label: "Job Location",
      description: "Location of the job",
      optional: true,
      async options() {
        const locations = await this.getLocations();
        return locations.map((loc) => ({
          label: loc.name,
          value: loc.id,
        }));
      },
    },
    jobType: {
      type: "string",
      label: "Job Type",
      description: "Type of the job (e.g., full-time, part-time)",
      optional: true,
      options: [
        {
          label: "Full-time",
          value: "full-time",
        },
        {
          label: "Part-time",
          value: "part-time",
        },
        {
          label: "Contract",
          value: "contract",
        },
      ],
    },
    applicationDeadline: {
      type: "string",
      label: "Application Deadline",
      description: "Deadline for job applications (YYYY-MM-DD)",
      optional: true,
    },
    candidateId: {
      type: "string",
      label: "Candidate ID",
      description: "The ID of the candidate to link",
      async options() {
        const candidates = await this.listCandidates();
        return candidates.map((candidate) => ({
          label: candidate.name,
          value: candidate.id,
        }));
      },
    },
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The ID of the job to link with the candidate",
      async options() {
        const jobListings = await this.listJobListings();
        return jobListings.map((job) => ({
          label: job.title,
          value: job.id,
        }));
      },
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.taleez.com";
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
    async listJobListings(opts = {}) {
      const params = {
        department: this.departmentFilter,
        location: this.locationFilter,
        ...opts.params,
      };
      return this._makeRequest({
        path: "/job_listings",
        method: "GET",
        params,
      });
    },
    async getDepartments(opts = {}) {
      return this._makeRequest({
        path: "/departments",
        method: "GET",
        ...opts,
      });
    },
    async getLocations(opts = {}) {
      return this._makeRequest({
        path: "/locations",
        method: "GET",
        ...opts,
      });
    },
    async listCandidates(opts = {}) {
      return this._makeRequest({
        path: "/candidates",
        method: "GET",
        ...opts,
      });
    },
    async createCandidate(opts = {}) {
      const data = {
        name: this.candidateName,
        email: this.email,
        job_listing_id: this.jobListingId,
        resume: this.resume,
        cover_letter: this.coverLetter,
        ...opts.data,
      };
      return this._makeRequest({
        path: "/candidates",
        method: "POST",
        data,
      });
    },
    async createJobListing(opts = {}) {
      const data = {
        title: this.jobTitle,
        department: this.department,
        description: this.jobDescription,
        location: this.jobLocation,
        type: this.jobType,
        application_deadline: this.applicationDeadline,
        ...opts.data,
      };
      return this._makeRequest({
        path: "/job_listings",
        method: "POST",
        data,
      });
    },
    async linkCandidateToJobOffer(opts = {}) {
      const data = {
        candidate_id: this.candidateId,
        job_id: this.jobId,
        ...opts.data,
      };
      return this._makeRequest({
        path: "/candidates/link",
        method: "POST",
        data,
      });
    },
    async emitNewCandidateEvent(callbackUrl) {
      const data = {
        url: callbackUrl,
        events: [
          "candidate_added",
        ],
        job_listing_id: this.jobListingId,
        department: this.departmentFilter,
        location: this.locationFilter,
      };
      return this._makeRequest({
        path: "/webhooks/candidates",
        method: "POST",
        data,
      });
    },
    async emitNewJobListingEvent(callbackUrl) {
      const data = {
        url: callbackUrl,
        events: [
          "job_listing_created",
        ],
        department: this.departmentFilter,
        location: this.locationFilter,
      };
      return this._makeRequest({
        path: "/webhooks/job_listings",
        method: "POST",
        data,
      });
    },
    async paginate(fn, ...opts) {
      let results = [];
      let hasMore = true;
      let page = 1;

      while (hasMore) {
        const response = await fn({
          ...opts,
          params: {
            ...opts[0]?.params,
            page,
          },
        });
        if (response.length === 0) {
          hasMore = false;
        } else {
          results = results.concat(response);
          page += 1;
        }
      }

      return results;
    },
  },
};
