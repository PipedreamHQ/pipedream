import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "niceboard",
  propDefinitions: {
    niceboardUrl: {
      type: "string",
      label: "Niceboard URL",
      description: "If your Niceboard account uses a custom domain or subdomain, enter it here. Otherwise, enter your Niceboard URL (Manage Board -> General -> Base Settings), and include the full domain. Example: `myboard.niceboard.co`",
    },
    companyId: {
      type: "string",
      label: "Company ID",
      description: "Identifier of the company of the job posting",
      async options({ niceboardUrl }) {
        const { results: { companies } } = await this.listCompanies({
          niceboardUrl,
        });
        return companies?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    jobTypeId: {
      type: "string",
      label: "Job Type ID",
      description: "Identifier of the type of the job posting",
      async options({ niceboardUrl }) {
        const { results: { jobtypes } } = await this.listJobTypes({
          niceboardUrl,
        });
        return jobtypes?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    categoryId: {
      type: "string",
      label: "Category ID",
      description: "Identifier of the category of the job posting",
      async options({ niceboardUrl }) {
        const { results: { categories } } = await this.listCategories({
          niceboardUrl,
        });
        return categories?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    locationId: {
      type: "string",
      label: "Location ID",
      description: "Identifier of the location of the job posting",
      async options({ niceboardUrl }) {
        const { results: { locations } } = await this.listLocations({
          niceboardUrl,
        });
        return locations?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The ID of the job",
      async options({
        niceboardUrl, page,
      }) {
        const { results: { jobs } } = await this.listJobs({
          niceboardUrl,
          params: {
            page: page + 1,
          },
        });
        return jobs?.map(({
          id: value, title: label,
        }) => ({
          value,
          label,
        })) || [];
      },
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
    minSalary: {
      type: "integer",
      label: "Minimum Salary",
      description: "Minimum salary value",
      optional: true,
    },
    maxSalary: {
      type: "integer",
      label: "Maximum Salary",
      description: "Maximum salary value",
      optional: true,
    },
    salaryTimeframe: {
      type: "string",
      label: "Salary Timeframe",
      description: "Required if minimum or maximum salary values submitted",
      options: [
        "annually",
        "monthly",
        "hourly",
        "weekly",
      ],
      optional: true,
    },
  },
  methods: {
    _baseUrl(niceboardUrl) {
      return `https://${niceboardUrl}/api/v1`;
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        params,
        niceboardUrl,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl(niceboardUrl)}${path}`,
        params: {
          ...params,
          key: this.$auth.secret_key,
        },
      });
    },
    listCompanies(opts = {}) {
      return this._makeRequest({
        path: "/companies",
        ...opts,
      });
    },
    listJobTypes(opts = {}) {
      return this._makeRequest({
        path: "/jobtypes",
        ...opts,
      });
    },
    listCategories(opts = {}) {
      return this._makeRequest({
        path: "/categories",
        ...opts,
      });
    },
    listLocations(opts = {}) {
      return this._makeRequest({
        path: "/locations",
        ...opts,
      });
    },
    listJobs(opts = {}) {
      return this._makeRequest({
        path: "/jobs",
        ...opts,
      });
    },
    listJobAlerts(opts = {}) {
      return this._makeRequest({
        path: "/jobalerts",
        ...opts,
      });
    },
    listJobSeekers(opts = {}) {
      return this._makeRequest({
        path: "/jobseekers",
        ...opts,
      });
    },
    createJob(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/jobs",
        ...opts,
      });
    },
    createCategory(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/categories",
        ...opts,
      });
    },
    updateJob({
      jobId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/jobs/${jobId}`,
        ...opts,
      });
    },
  },
};
