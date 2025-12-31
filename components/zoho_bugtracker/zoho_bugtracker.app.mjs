import { axios } from "@pipedream/platform";
import { limit } from "./common/constants.mjs";

export default {
  type: "app",
  app: "zoho_bugtracker",
  propDefinitions: {
    assignee: {
      type: "string",
      label: "Assignee",
      description: "Assignee for the bug",
      async options({
        page, portalId,
      }) {
        const { users } = await this.listUsers({
          portalId,
          params: {
            page: page + 1,
            per_page: limit,
          },
        });

        return users
          ? users.map(({
            id: value, full_name, email,
          }) => ({
            label: `${full_name} ${email}`,
            value,
          }))
          : [];
      },
    },
    bugFollowers: {
      type: "string[]",
      label: "Bug Followers",
      description: "Follower IDs of the users",
      async options({
        page, portalId,
      }) {
        const { users } = await this.listUsers({
          portalId,
          params: {
            page: page + 1,
            per_page: limit,
          },
        });

        return users
          ? users.map(({
            id: value, full_name, email,
          }) => ({
            label: `${full_name} ${email}`,
            value,
          }))
          : [];
      },
    },
    bugId: {
      type: "string",
      label: "Bug ID",
      description: "The ID of the bug",
      async options({
        page, portalId, projectId,
      }) {
        const { issues: bugs } = await this.listBugs({
          portalId,
          projectId,
          params: {
            page: page + 1,
            per_page: limit,
          },
        });

        return bugs
          ? bugs.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          }))
          : [];
      },
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the bug",
    },
    flag: {
      type: "string",
      label: "Flag",
      description: "Flag of the bug",
      options: [
        "Internal",
        "External",
      ],
    },
    milestoneId: {
      type: "string",
      label: "Milestone ID",
      description: "Milestone ID of the project",
      async options({
        page, portalId, projectId,
      }) {
        const { milestones } = await this.listMilestones({
          portalId,
          projectId,
          params: {
            page: page + 1,
            per_page: limit,
          },
        });

        return milestones
          ? milestones.map(({
            id_string: value, name: label,
          }) => ({
            label,
            value,
          }))
          : [];
      },
    },
    portalId: {
      type: "string",
      label: "Portal ID",
      description: "Select a portal or provide a portal ID",
      async options() {
        const portals = await this.listPortals();

        return portals?.map(({
          id: value, portal_name: label,
        }) => ({
          label,
          value: value,
        }));
      },
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "Select a project or provide a project ID",
      async options({
        page, portalId,
      }) {
        const projects = await this.listProjects({
          portalId,
          params: {
            page: page + 1,
            per_page: limit,
          },
        });

        return projects
          ? projects.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          }))
          : [];
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the bug",
    },
    uploaddoc: {
      type: "string",
      label: "Upload Doc File Path or URL",
      description: "The file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`. Please configure [Zoho Drive integration](https://help.zoho.com/portal/en/kb/projects/integration/zoho-apps/articles/zoho-workdrive-integration) to enable attachment for your Zoho BugTracker. The maximum size to upload a file is 128 MB.",
    },
  },
  methods: {
    _apiUrl() {
      return `https://bugtracker.${this.$auth.base_api_uri}/api/v3`;
    },
    _getHeaders(headers) {
      return {
        "Authorization": `Zoho-oauthtoken ${this.$auth.oauth_access_token}`,
        ...headers,
      };
    },
    async _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}${path}`,
        headers: this._getHeaders(headers),
        ...opts,
      };
      return axios($, config);
    },
    createBug({
      portalId, projectId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/portal/${portalId}/projects/${projectId}/issues`,
        ...args,
      });
    },
    getBug({
      portalId, projectId, bugId, ...args
    }) {
      return this._makeRequest({
        path: `/portal/${portalId}/projects/${projectId}/issues/${bugId}`,
        ...args,
      });
    },
    listBugs({
      portalId, projectId, ...args
    }) {
      return this._makeRequest({
        path: `/portal/${portalId}/projects/${projectId}/issues`,
        ...args,
      });
    },
    listMilestones({
      portalId, projectId, ...args
    }) {
      return this._makeRequest({
        path: `/portal/${portalId}/projects/${projectId}/milestones`,
        ...args,
      });
    },
    listPortals(args = {}) {
      return this._makeRequest({
        path: "/portals",
        ...args,
      });
    },
    listProjects({
      portalId, ...args
    }) {
      return this._makeRequest({
        path: `/portal/${portalId}/projects`,
        ...args,
      });
    },
    listUsers({
      portalId, ...args
    }) {
      return this._makeRequest({
        path: `/portal/${portalId}/users`,
        ...args,
      });
    },
    updateBug({
      portalId, projectId, bugId, ...args
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/portal/${portalId}/projects/${projectId}/issues/${bugId}`,
        ...args,
      });
    },
    async *paginate({
      fn, params = {}, resourceKey, maxResults = null, ...args
    }) {
      let lastPage = false;
      let count = 0;
      let page = 0;
      params.per_page = limit;

      do {
        params.page = (page * limit) + 1;
        page++;
        const data = await fn({
          params,
          ...args,
        });

        if (!data) return false;

        for (const d of resourceKey
          ? data[resourceKey]
          : data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        lastPage = data.page_info.has_next_page;

      } while (lastPage);
    },
  },
};
