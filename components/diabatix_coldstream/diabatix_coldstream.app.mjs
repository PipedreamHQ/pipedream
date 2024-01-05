import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "diabatix_coldstream",
  propDefinitions: {
    caseId: {
      type: "integer",
      label: "Case ID",
      description: "The ID of the case in ColdStream.",
      async options({
        page, projectId,
      }) {
        const { items } = await this.listCases({
          projectId,
          params: {
            pageNumber: page,
          },
        });

        return items.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    organizationId: {
      type: "integer",
      label: "Organization ID",
      description: "The ID of the organization in ColdStream.",
      async options() {
        const { organizations } = await this.getMe();

        return organizations.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    projectId: {
      type: "integer",
      label: "Project ID",
      description: "The ID of the project in ColdStream.",
      async options({
        page, organizationId,
      }) {
        const { items } = await this.listProjects({
          organizationId,
          params: {
            pageNumber: page,
          },
        });

        return items.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    caseType: {
      type: "integer",
      label: "Case Type",
      description: "The type of the case",
      options: [
        {
          label: "Simulation",
          value: 1,
        },
      ],
    },
    asyncProjectId: {
      type: "integer",
      label: "Async Project ID",
      description: "The project ID used for asynchronous operations",
    },
    asyncCaseId: {
      type: "integer",
      label: "Async Case ID",
      description: "The case ID used for asynchronous operations",
    },
    caseName: {
      type: "string",
      label: "Case Name",
      description: "The name of the case",
    },
    caseStatus: {
      type: "integer[]",
      label: "Case Status",
      description: "Status of the case",
    },
  },
  methods: {
    _baseUrl(baseAPI) {
      return `https://${baseAPI}.coldstream.diabatix.com`;
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.access_token}`,
        "accept": "application/json",
      };
    },
    _makeRequest({
      $, baseAPI, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl(baseAPI)}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    getCurrentUserOrganizations($) {
      return this._makeRequest({
        $,
        method: "GET",
        path: "/users/me/organizations",
      });
    },
    getMe(opts = {}) {
      return this._makeRequest({
        baseAPI: "identity",
        path: "/users/me",
        ...opts,
      });
    },
    getProject({ projectId }) {
      return this._makeRequest({
        baseAPI: "project",
        path: `/projects/${projectId}`,
      });
    },
    updateProject({
      projectId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        baseAPI: "project",
        path: `/projects/${projectId}`,
        ...opts,
      });
    },
    createCase(opts = {}) {
      return this._makeRequest({
        method: "POST",
        baseAPI: "case",
        path: "/cases",
        ...opts,
      });
    },
    submitCase(opts = {}) {
      return this._makeRequest({
        method: "POST",
        baseAPI: "case",
        path: "/cases/submit",
        ...opts,
      });
    },
    getCaseResults({
      caseId, ...opts
    }) {
      return this._makeRequest({
        baseAPI: "case",
        path: `/cases/result/${caseId}`,
        opts,
      });
    },
    listCases({
      projectId, ...opts
    }) {
      return this._makeRequest({
        baseAPI: "case",
        path: `/projects/${projectId}/cases`,
        ...opts,
      });
    },
    listOrganizationCases({
      organizationId, params,
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/organizations/${organizationId}/cases`,
        params,
      });
    },
    listProjectCases({
      projectId, params,
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/projects/${projectId}/cases`,
        params,
      });
    },
    listProjects({
      organizationId, ...opts
    }) {
      return this._makeRequest({
        baseAPI: "project",
        path: `/organizations/${organizationId}/projects`,
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.PageNumber = page;
        page++;
        const {
          items,
          totalPages,
          pageNumber,
        } = await fn({
          params,
          ...opts,
        });
        for (const d of items) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = !(pageNumber == totalPages);

      } while (hasMore);
    },
  },
};
