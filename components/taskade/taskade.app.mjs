import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "taskade",
  propDefinitions: {
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "The ID of a workspace, e.g. `a1b2c3d4e5f6g7h8`."
        + " Use **List Workspaces** to find it (the `id` field).",
      async options() {
        const { items } = await this.listWorkspaces();
        return items?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "The ID of a folder in the workspace, e.g. `a1b2c3d4e5f6g7h8`."
        + " The `Home` folder has the same ID as the workspace."
        + " Use **List Folders** to find it (the `id` field).",
      async options({ workspaceId }) {
        if (!workspaceId) {
          return [];
        }
        const { items } = await this.listFolders({
          workspaceId,
        });
        return items?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of a project, e.g. `a1b2c3d4e5f6g7h8`."
        + " The options list only the projects that you opened in Taskade."
        + " Use **List Projects** to find any project in a folder (the `id` field).",
      async options({ page }) {
        const { items } = await this.listProjects({
          params: {
            page: page + 1,
          },
        });
        return items?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of a task in the project, e.g. `85e89694-3ca9-49ac-8393-4595543d4643`."
        + " Use **List Tasks** with the same `projectId` to find it (the `id` field).",
      async options({
        projectId, prevContext,
      }) {
        if (!projectId) {
          return [];
        }
        if (prevContext?.cursor === null) {
          return [];
        }
        const {
          items, nextCursor,
        } = await this.listTasks({
          projectId,
          params: {
            after: prevContext?.cursor,
          },
        });
        return {
          options: items?.map(({
            id: value, text,
          }) => ({
            value,
            label: text || value,
          })) || [],
          context: {
            cursor: nextCursor ?? null,
          },
        };
      },
    },
    agentId: {
      type: "string",
      label: "Agent ID",
      description: "The ID of an AI agent in the folder, e.g. `01JC3K8Z5V7Q2M4N6P8R0T2W4Y`."
        + " Use **List Agents** with the same `folderId` to find it (the `id` field).",
      async options({
        folderId, page,
      }) {
        if (!folderId) {
          return [];
        }
        const { items } = await this.listAgents({
          folderId,
          params: {
            page: page + 1,
          },
        });
        return items?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    assignees: {
      type: "string[]",
      label: "Assignees",
      description: "The handles of the users to assign, e.g. `[\"janedoe\", \"johnsmith\"]`."
        + " Each user must be a member of the project or its workspace."
        + " Use **List Project Members** to find the handles (the `handle` field).",
      async options({
        projectId, page,
      }) {
        if (!projectId) {
          return [];
        }
        const { items } = await this.listProjectMembers({
          projectId,
          params: {
            page: page + 1,
          },
        });
        return items?.filter((item) => item?.handle)
          .map(({
            handle: value, displayName,
          }) => ({
            value,
            label: displayName || value,
          })) || [];
      },
    },
    content: {
      type: "string",
      label: "Content",
      description: "The text of the task, up to 2000 characters, e.g. `Review the launch checklist`.",
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description: "The format of `content`. One of `text/markdown`, `text/plain`. e.g. `text/markdown`.",
      options: [
        "text/markdown",
        "text/plain",
      ],
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of items to return, e.g. `50`. Defaults to `100`.",
      min: 1,
      default: 100,
      optional: true,
    },
  },
  methods: {
    _baseUrl(version = "v1") {
      return `https://www.taskade.com/api/${version}`;
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        version,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl(version)}${path}`,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    listWorkspaces(opts = {}) {
      return this._makeRequest({
        path: "/workspaces",
        ...opts,
      });
    },
    listFolders({
      workspaceId, ...opts
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/folders`,
        ...opts,
      });
    },
    listProjects(opts = {}) {
      return this._makeRequest({
        path: "/me/projects",
        ...opts,
      });
    },
    listFolderProjects({
      folderId, ...opts
    }) {
      return this._makeRequest({
        path: `/folders/${folderId}/projects`,
        ...opts,
      });
    },
    getProject({
      projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}`,
        ...opts,
      });
    },
    createProject(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/projects",
        ...opts,
      });
    },
    listProjectMembers({
      projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/members`,
        ...opts,
      });
    },
    listTasks({
      projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/tasks`,
        ...opts,
      });
    },
    createTask({
      projectId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/projects/${projectId}/tasks`,
        ...opts,
      });
    },
    updateTask({
      projectId, taskId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/projects/${projectId}/tasks/${taskId}`,
        ...opts,
      });
    },
    completeTask({
      projectId, taskId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/projects/${projectId}/tasks/${taskId}/complete`,
        // The API rejects an empty body with a JSON content type.
        data: {},
        ...opts,
      });
    },
    deleteTask({
      projectId, taskId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/projects/${projectId}/tasks/${taskId}`,
        // The API rejects an empty body with a JSON content type.
        data: {},
        ...opts,
      });
    },
    assignTask({
      projectId, taskId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/projects/${projectId}/tasks/${taskId}/assignees`,
        ...opts,
      });
    },
    createOrUpdateDueDate({
      projectId, taskId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/projects/${projectId}/tasks/${taskId}/date`,
        ...opts,
      });
    },
    listAgents({
      folderId, ...opts
    }) {
      return this._makeRequest({
        path: `/folders/${folderId}/agents`,
        ...opts,
      });
    },
    promptAgent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        version: "v2",
        path: "/promptAgent",
        ...opts,
      });
    },
    async *paginate({
      resourceFn,
      args,
      resourceType,
      max,
    }) {
      args = {
        ...args,
        params: {
          ...args.params,
        },
      };
      let count = 0;
      do {
        const results = await resourceFn(args);
        const items = resourceType
          ? results[resourceType]
          : results;
        if (!items?.length) {
          return;
        }
        for (const item of items) {
          yield item;
          count++;
          if (max && count >= max) {
            return;
          }
        }
        args.params.after = results.nextCursor;
      } while (args.params.after);
    },
    async *paginateByPage({
      resourceFn,
      args,
      max,
    }) {
      const limit = 100;
      args = {
        ...args,
        params: {
          ...args.params,
          limit,
          page: 1,
        },
      };
      let count = 0;
      while (true) {
        const { items } = await resourceFn(args);
        if (!items?.length) {
          return;
        }
        for (const item of items) {
          yield item;
          count++;
          if (max && count >= max) {
            return;
          }
        }
        if (items.length < limit) {
          return;
        }
        args.params.page++;
      }
    },
  },
};
