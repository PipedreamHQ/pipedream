import { axios } from "@pipedream/platform";
import { limit } from "./common/base.mjs";

export default {
  type: "app",
  app: "hive",
  propDefinitions: {
    assignees: {
      type: "string[]",
      label: "Assignees",
      description: "User Ids of action assignees; if value isn't passed the action will be assigned to the user Id of the request.",
      async options({ workspaceId }) {
        const data = await this.listUsers({
          workspaceId,
        });

        return data.map(({
          id: value, email: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Add custom fields to the action: Each object must contain label (string) and value (string).",
    },
    deadline: {
      type: "string",
      label: "Deadline",
      description: "Date string to set the deadline (date format: yyyy/mm/dd).",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the action.",
    },
    labels: {
      type: "string[]",
      label: "Labels",
      description: "Set Labels (Label IDs) for the Action.",
      async options({
        page, workspaceId,
      }) {
        const data = await this.listLabels({
          workspaceId,
          params: {
            limit,
            skip: limit * page,
          },
        });

        return data.map(({
          _id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    parentId: {
      type: "string",
      label: "Parent Id",
      description: "ID of an Action to set as the parent for your new Action.",
      async options({ workspaceId }) {
        const data = await this.listActions({
          workspaceId,
          params: {
            limit: 100,
          },
        });

        return data.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    phaseId: {
      type: "string",
      label: "Phase Id",
      description: "ID of a project phase which will be assigned to the created action. If both phaseId and phaseName are sent than phaseId will be used.",
      async options({ projectId }) {
        const { project: { phases } } = await this.getProject({
          projectId,
        });

        return phases.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    phaseName: {
      type: "string",
      label: "Phase Name",
      description: "Name of a project phase which will be assigned to the created action. If both phaseId and phaseName are sent than phaseId will be used.",
      async options({ projectId }) {
        const { project: { phases } } = await this.getProject({
          projectId,
        });

        return phases.map(({ name }) => name);
      },
    },
    processId: {
      type: "string",
      label: "Proccess Id",
      description: "Pass action template id to apply an action template.",
      async options({ workspaceId }) {
        const data = await this.listTemplates({
          workspaceId,
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    projectId: {
      type: "string",
      label: "Project Id",
      description: "Assign action to a specific project.",
      async options({ workspaceId }) {
        const data = await this.listProjects({
          workspaceId,
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    scheduledDate: {
      type: "string",
      label: "scheduledDate",
      description: "Date string to set the deadline (date format: yyyy/mm/dd).",
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the action.",
    },
    workspaceId: {
      type: "string",
      label: "Workspace Id",
      description: "ID of the workspace",
      async options({ page }) {
        const data = await this.listWorkspaces({
          params: {
            page,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://app.hive.com/api/v1";
    },
    _getAuth() {
      return {
        api_key: this.$auth.api_key,
        user_id: this.$auth.user_id,
      };
    },
    async _makeRequest({
      $ = this, params, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        params: {
          ...params,
          ...this._getAuth(),
        },
        ...opts,
      };

      return axios($, config);
    },
    createAction(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "actions/create",
        ...args,
      });
    },
    getProject({
      projectId, ...args
    }) {
      return this._makeRequest({
        path: `projects/${projectId}`,
        ...args,
      });
    },
    listActions({
      workspaceId, ...args
    }) {
      return this._makeRequest({
        path: `workspaces/${workspaceId}/actions`,
        ...args,
      });
    },
    listLabels({
      workspaceId, ...args
    }) {
      return this._makeRequest({
        path: `workspaces/${workspaceId}/labels`,
        ...args,
      });
    },
    listTemplates({
      workspaceId, ...args
    }) {
      return this._makeRequest({
        path: `workspaces/${workspaceId}/actiontemplates`,
        ...args,
      });
    },
    listStatuses({
      workspaceId, ...args
    }) {
      return this._makeRequest({
        path: `workspaces/${workspaceId}/project-statuses`,
        ...args,
      });
    },
    listProjects({
      workspaceId, ...args
    }) {
      return this._makeRequest({
        path: `workspaces/${workspaceId}/projects`,
        ...args,
      });
    },
    listUsers({
      workspaceId, ...args
    }) {
      return this._makeRequest({
        path: `workspaces/${workspaceId}/users`,
        ...args,
      });
    },
    listWorkspaces(args = {}) {
      return this._makeRequest({
        path: "workspaces",
        ...args,
      });
    },
  },
};
