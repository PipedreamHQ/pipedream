import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "retable",
  propDefinitions: {
    workspaceId: {
      type: "string",
      label: "Workspace",
      description: "Identifier or a workspace",
      async options() {
        const { data: { workspaces } } = await this.listWorkspaces();
        return workspaces.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    projectId: {
      type: "string",
      label: "Project",
      description: "Identifier or a project",
      async options({ workspaceId }) {
        if (!workspaceId) {
          return [];
        }
        const { data: { projects } } = await this.listProjects({
          workspaceId,
        });
        return projects.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    retableId: {
      type: "string",
      label: "Retable",
      description: "Identifier or a retable",
      async options({ projectId }) {
        if (!projectId) {
          return [];
        }
        const { data: { retables } } = await this.listRetables({
          projectId,
        });
        return retables.map(({
          id: value, title: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    rowId: {
      type: "string",
      label: "Row",
      description: "Identifier or a row",
      async options({ retableId }) {
        if (!retableId) {
          return [];
        }
        const { data: { rows } } = await this.listRows({
          retableId,
        });
        return rows.map(({ row_id: value }) => ({
          value,
          label: `Row ${value}`,
        }));
      },
    },
    columnIds: {
      type: "string[]",
      label: "ColumnIds",
      description: "Array of column identifiers",
      async options({ retableId }) {
        if (!retableId) {
          return [];
        }
        const { data: { columns } } = await this.getRetable({
          retableId,
        });
        return columns.map(({
          column_id: value, title: label,
        }) => ({
          value,
          label,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.retable.io/v1/public";
    },
    _headers() {
      return {
        "ApiKey": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
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
    getRetable({
      retableId, ...args
    }) {
      return this._makeRequest({
        path: `/retable/${retableId}`,
        ...args,
      });
    },
    listWorkspaces(args = {}) {
      return this._makeRequest({
        path: "/workspace",
        ...args,
      });
    },
    listProjects({
      workspaceId, ...args
    }) {
      return this._makeRequest({
        path: `/workspace/${workspaceId}/project`,
        ...args,
      });
    },
    listRetables({
      projectId, ...args
    }) {
      return this._makeRequest({
        path: `/project/${projectId}/retable`,
        ...args,
      });
    },
    listRows({
      retableId, ...args
    }) {
      return this._makeRequest({
        path: `/retable/${retableId}/data`,
        ...args,
      });
    },
    createRecord({
      retableId, ...args
    }) {
      return this._makeRequest({
        path: `/retable/${retableId}/data`,
        method: "POST",
        ...args,
      });
    },
    updateRecord({
      retableId, ...args
    }) {
      return this._makeRequest({
        path: `/retable/${retableId}/data`,
        method: "PUT",
        ...args,
      });
    },
  },
};
