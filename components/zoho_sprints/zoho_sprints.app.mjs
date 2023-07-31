import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zoho_sprints",
  propDefinitions: {
    teamId: {
      type: "string",
      label: "Team",
      description: "Identifier of a team",
      async options() {
        const { portals } = await this.listTeams();
        return portals?.map(({
          teamName, zsoid,
        }) => ({
          label: teamName,
          value: zsoid,
        })) || [];
      },
    },
    projectId: {
      type: "string",
      label: "Project",
      description: "Identifier of a project",
      async options({
        teamId, prevContext,
      }) {
        const { index = 1 } = prevContext;
        const params = {
          action: "allprojects",
          index,
          range: 10,
        };
        const { projectJObj } = await this.listProjects({
          teamId,
          params,
        });
        const projects = [];
        for (const [
          key,
          value,
        ] of Object.entries(projectJObj)) {
          projects.push({
            label: value[0],
            value: key,
          });
        }
        return {
          options: projects,
          context: {
            index: params.index + params.range,
          },
        };
      },
    },
    statusId: {
      type: "string",
      label: "Status",
      description: "Identifier of a project status",
      async options({
        teamId, projectId,
      }) {
        const { statusJObj } = await this.getProjectStatus({
          teamId,
          projectId,
          params: {
            action: "data",
          },
        });
        const statuses = [];
        for (const [
          key,
          value,
        ] of Object.entries(statusJObj)) {
          statuses.push({
            label: value[0],
            value: key,
          });
        }
        return statuses;
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.base_api_uri}`;
    },
    _headers() {
      return {
        Authorization: `Zoho-oauthtoken ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    listTeams(args = {}) {
      return this._makeRequest({
        path: "/teams/",
        ...args,
      });
    },
    listItemTypes({
      teamId, projectId, ...args
    }) {
      return this._makeRequest({
        path: `/team/${teamId}/projects/${projectId}/itemtype/`,
        ...args,
      });
    },
    listPriorityTypes({
      teamId, projectId, ...args
    }) {
      return this._makeRequest({
        path: `/team/${teamId}/projects/${projectId}/priority/`,
        ...args,
      });
    },
    getProjectStatus({
      teamId, projectId, ...args
    }) {
      return this._makeRequest({
        path: `/team/${teamId}/projects/${projectId}/itemstatus/`,
        ...args,
      });
    },
    updateProject({
      teamId, projectId, ...args
    }) {
      return this._makeRequest({
        path: `/team/${teamId}/projects/${projectId}/`,
        method: "POST",
        ...args,
      });
    },
  },
};
