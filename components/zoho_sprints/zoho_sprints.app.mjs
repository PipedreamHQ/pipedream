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
      type: "integer",
      label: "Status",
      description: "Identifier of a project status",
      options: [
        {
          label: "Active",
          value: 1,
        },
        {
          label: "Archive",
          value: 2,
        },
      ],
    },
    sprintId: {
      type: "string",
      label: "Sprint",
      description: "Identifier of a sprint",
      async options({
        teamId, projectId, prevContext,
      }) {
        const { index = 1 } = prevContext;
        const params = {
          action: "data",
          index,
          range: 10,
        };
        const { sprintJObj } = await this.listSprints({
          teamId,
          projectId,
          params,
        });
        const sprints = [];
        if (!sprintJObj) {
          return sprints;
        }
        for (const [
          key,
          value,
        ] of Object.entries(sprintJObj)) {
          sprints.push({
            label: value[0],
            value: key,
          });
        }
        return {
          options: sprints,
          context: {
            index: params.index + params.range,
          },
        };
      },
    },
    itemTypeId: {
      type: "string",
      label: "Item Type",
      description: "Identifier of an item type",
      async options({
        teamId, projectId,
      }) {
        const { projItemTypeJObj } = await this.listItemTypes({
          teamId,
          projectId,
          params: {
            action: "alldata",
          },
        });
        const types = [];
        for (const [
          key,
          value,
        ] of Object.entries(projItemTypeJObj)) {
          types.push({
            label: value[0],
            value: key,
          });
        }
        return types;
      },
    },
    priorityTypeId: {
      type: "string",
      label: "Priority Type",
      description: "Identifier of a priority type",
      async options({
        teamId, projectId, prevContext,
      }) {
        const { index = 1 } = prevContext;
        const params = {
          action: "data",
          index,
          range: 10,
        };
        const { projPriorityJObj } = await this.listPriorityTypes({
          teamId,
          projectId,
          params,
        });
        const types = [];
        for (const [
          key,
          value,
        ] of Object.entries(projPriorityJObj)) {
          types.push({
            label: value[0],
            value: key,
          });
        }
        return {
          options: types,
          context: {
            index: params.index + params.range,
          },
        };
      },
    },
    assignees: {
      type: "string[]",
      label: "Assignees",
      description: "User IDs of the users who will work on the item",
      optional: true,
      async options({
        teamId, projectId, sprintId, prevContext,
      }) {
        const { index = 1 } = prevContext;
        const params = {
          action: "data",
          index,
          range: 10,
        };
        const { userJObj } = await this.listProjectUsers({
          teamId,
          projectId,
          sprintId,
          params,
        });
        const users = [];
        for (const [
          key,
          value,
        ] of Object.entries(userJObj)) {
          users.push({
            label: value[0],
            value: key,
          });
        }
        return {
          options: users,
          context: {
            index: params.index + params.range,
          },
        };
      },
    },
    epicId: {
      type: "string",
      label: "Epic",
      description: "Identifier of an epic",
      optional: true,
      async options({
        teamId, projectId, prevContext,
      }) {
        const { index = 1 } = prevContext;
        const params = {
          action: "data",
          index,
          range: 10,
        };
        const { epicJObj } = await this.listEpics({
          teamId,
          projectId,
          params,
        });
        const epics = [];
        if (!epicJObj) {
          return epics;
        }
        for (const [
          key,
          value,
        ] of Object.entries(epicJObj)) {
          epics.push({
            label: value[0],
            value: key,
          });
        }
        return {
          options: epics,
          context: {
            index: params.index + params.range,
          },
        };
      },
    },
    itemId: {
      type: "string",
      label: "Item",
      description: "Identifier of a task, story, or bug",
      optional: true,
      async options({
        teamId, projectId, sprintId, prevContext,
      }) {
        const { index = 1 } = prevContext;
        const params = {
          action: "sprintitems",
          index,
          range: 10,
        };
        const { itemJObj } = await this.listItems({
          teamId,
          projectId,
          sprintId,
          params,
        });
        const items = [];
        for (const [
          key,
          value,
        ] of Object.entries(itemJObj)) {
          items.push({
            label: value[0],
            value: key,
          });
        }
        return {
          options: items,
          context: {
            index: params.index + params.range,
          },
        };
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
    listProjects({
      teamId, ...args
    }) {
      return this._makeRequest({
        path: `/team/${teamId}/projects/`,
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
    listSprints({
      teamId, projectId, ...args
    }) {
      return this._makeRequest({
        path: `/team/${teamId}/projects/${projectId}/sprints/`,
        ...args,
      });
    },
    listProjectUsers({
      teamId, projectId, ...args
    }) {
      return this._makeRequest({
        path: `/team/${teamId}/projects/${projectId}/users/`,
        ...args,
      });
    },
    listEpics({
      teamId, projectId, ...args
    }) {
      return this._makeRequest({
        path: `/team/${teamId}/projects/${projectId}/epic/`,
        ...args,
      });
    },
    listItems({
      teamId, projectId, sprintId, ...args
    }) {
      return this._makeRequest({
        path: `/team/${teamId}/projects/${projectId}/sprints/${sprintId}/item/`,
        ...args,
      });
    },
    getItem({
      teamId, projectId, sprintId, itemId, ...args
    }) {
      return this._makeRequest({
        path: `/team/${teamId}/projects/${projectId}/sprints/${sprintId}/item/${itemId}/`,
        ...args,
      });
    },
    getProject({
      teamId, projectId, ...args
    }) {
      return this._makeRequest({
        path: `/team/${teamId}/projects/${projectId}/`,
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
    createItem({
      teamId, projectId, sprintId, ...args
    }) {
      return this._makeRequest({
        path: `/team/${teamId}/projects/${projectId}/sprints/${sprintId}/item/`,
        method: "POST",
        ...args,
      });
    },
    deleteItem({
      teamId, projectId, sprintId, itemId, ...args
    }) {
      return this._makeRequest({
        path: `/team/${teamId}/projects/${projectId}/sprints/${sprintId}/item/${itemId}/`,
        method: "DELETE",
        ...args,
      });
    },
    createWebhook({
      teamId, ...args
    }) {
      return this._makeRequest({
        path: `/team/${teamId}/webhooks/`,
        method: "POST",
        ...args,
      });
    },
    deleteWebhook({
      teamId, webhookId, ...args
    }) {
      return this._makeRequest({
        path: `/team/${teamId}/webhooks/${webhookId}/`,
        method: "DELETE",
        ...args,
      });
    },
  },
};
