import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "taleez",
  propDefinitions: {
    jobId: {
      type: "string",
      label: "Job Listing ID",
      description: "The ID of the job listing",
      async options({ page }) {
        const { list } = await this.listJobs({
          params: {
            page,
          },
        });
        return list?.map(({
          id: value, label,
        }) => ({
          label,
          value,
        }));
      },
    },
    candidateId: {
      type: "string",
      label: "Candidate ID",
      description: "The ID of the candidate to link",
      async options({ page }) {
        const { list } = await this.listCandidates({
          params: {
            page,
          },
        });
        return list?.map(({
          id: value, firstName, lastName,
        }) => ({
          label: `${firstName} ${lastName}`,
          value,
        }));
      },
    },
    unitId: {
      type: "string",
      label: "Unit ID",
      description: "Filter by unit ID",
      optional: true,
      async options({ page }) {
        const { list } = await this.listUnits({
          params: {
            page,
          },
        });
        return list?.map(({
          id: value, publicName: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    recruiterId: {
      type: "string",
      label: "Recruiter ID",
      description: "The ID of the recruiter adding this candidate",
      optional: true,
      async options({ page }) {
        const { list } = await this.listRecruiters({
          params: {
            page,
          },
        });
        return list?.map(({
          id: value, firstName, lastName,
        }) => ({
          label: `${firstName} ${lastName}`,
          value,
        }));
      },
    },
    status: {
      type: "string",
      label: "Status",
      description: "Filter by job status",
      options: [
        "DRAFT",
        "PUBLISHED",
        "DONE",
        "SUSPENDED",
      ],
      optional: true,
    },
    contract: {
      type: "string",
      label: "Contract",
      description: "Filter by job contract",
      options: [
        "CDI",
        "CDD",
        "INTERIM",
        "FREELANCE",
        "INTERNSHIP",
        "APPRENTICESHIP",
        "STUDENT",
        "VIE",
        "FRANCHISE",
        "STATUTE",
        "VACATAIRE",
        "LIBERAL",
        "CDI_CHANTIER",
        "INTERMITTENT",
        "SEASON",
        "OTHER",
        "VOLUNTEER",
        "PERMANENT",
        "FIXEDTERM",
      ],
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "Filter by job city",
      optional: true,
    },
    companyLabel: {
      type: "string",
      label: "Company Label",
      description: "Filter by company label",
      optional: true,
    },
    tag: {
      type: "string",
      label: "Tag",
      description: "Filter by job tag",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.taleez.com/0";
    },
    _makeRequest({
      $ = this,
      path,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "x-taleez-api-secret": this.$auth.secret_key,
        },
      });
    },
    listJobs(opts = {}) {
      return this._makeRequest({
        path: "/jobs",
        ...opts,
      });
    },
    listCandidates(opts = {}) {
      return this._makeRequest({
        path: "/candidates",
        ...opts,
      });
    },
    listUnits(opts = {}) {
      return this._makeRequest({
        path: "/units",
        ...opts,
      });
    },
    listRecruiters(opts = {}) {
      return this._makeRequest({
        path: "/recruiters",
        ...opts,
      });
    },
    createCandidate(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/candidates",
        ...opts,
      });
    },
    linkCandidateToJob({
      jobId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/jobs/${jobId}/candidates`,
        ...opts,
      });
    },
    async *paginate({
      fn, args = {}, max,
    }) {
      let hasMorePages = true;
      let page = 0;
      let count = 0;

      while (hasMorePages) {
        const {
          list, hasMore,
        } = await fn({
          ...args,
          params: {
            ...args?.params,
            page,
            pageSize: 1000,
          },
        });
        for (const item of list) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        hasMorePages = hasMore;
        page++;
      }
    },
  },
};
