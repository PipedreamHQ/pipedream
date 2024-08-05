import { axios } from "@pipedream/platform";
import { STATUS_OPTIONS } from "./common/constants.mjs";

export default {
  type: "app",
  app: "hubstaff",
  propDefinitions: {
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "The ID of the organization",
      async options({ prevContext }) {
        const params = {};
        if (prevContext.nextToken) {
          params.page_start_id = prevContext.nextToken;
        }
        const {
          organizations, pagination,
        } = await this.listOrganizations({
          params,
        });
        return {
          options: organizations.map(({
            name: label, id: value,
          }) => ({
            label,
            value,
          })),
          context: {
            nextToken: pagination
              ? pagination.next_page_start_id
              : false,
          },
        };
      },
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project",
      async options({
        prevContext, organizationId,
      }) {
        const params = {};
        if (prevContext.nextToken) {
          params.page_start_id = prevContext.nextToken;
        }
        const {
          projects, pagination,
        } = await this.listProjects({
          params,
          organizationId,
        });

        return {
          options: projects.map(({
            name: label, id: value,
          }) => ({
            label,
            value,
          })),
          context: {
            nextToken: pagination
              ? pagination.next_page_start_id
              : false,
          },
        };
      },
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task",
      async options({
        prevContext, organizationId, projectId,
      }) {
        const params = {};
        if (prevContext.nextToken) {
          params.page_start_id = prevContext.nextToken;
        }
        const {
          tasks, pagination,
        } = await this.listTasks({
          params,
          organizationId,
          projectId,
        });

        return {
          options: tasks.map(({
            id: value, summary: label,
          }) => ({
            label,
            value,
          })),
          context: {
            nextToken: pagination
              ? pagination.next_page_start_id
              : false,
          },
        };
      },
    },
    userIds: {
      type: "string[]",
      label: "User IDs",
      description: "List of user IDs",
      async options({
        prevContext, organizationId, projectId,
      }) {
        const params = {
          include: [
            "users",
          ],
        };
        if (prevContext.nextToken) {
          params.page_start_id = prevContext.nextToken;
        }
        const {
          members, users, pagination,
        } = await this.listUsers({
          params,
          organizationId,
          projectId,
        });

        return {
          options: members.map(({ user_id: value }) => ({
            label: users.find((user) => user.id === value).name,
            value,
          })),
          context: {
            nextToken: pagination
              ? pagination.next_page_start_id
              : false,
          },
        };
      },
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the task",
      options: STATUS_OPTIONS,
    },
    summary: {
      type: "string",
      label: "Summary",
      description: "A brief summary of the task",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.hubstaff.com/v2";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    listClients({ organizationId }) {
      return this._makeRequest({
        path: `/organizations/${organizationId}/clients`,
      });
    },
    listOrganizations() {
      return this._makeRequest({
        path: "/organizations",
      });
    },
    listProjects({ organizationId }) {
      return this._makeRequest({
        path: `/organizations/${organizationId}/projects`,
      });
    },
    listSchedules({
      organizationId, ...opts
    }) {
      return this._makeRequest({
        path: `/organizations/${organizationId}/attendance_schedules`,
        ...opts,
      });
    },
    listTasks({ projectId }) {
      return this._makeRequest({
        path: `/projects/${projectId}/tasks`,
      });
    },
    listUsers({
      organizationId, projectId, ...opts
    }) {
      return this._makeRequest({
        path: `${projectId
          ? `/projects/${projectId}`
          : `/organizations/${organizationId}`}/members`,
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
      taskId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/tasks/${taskId}`,
        ...opts,
      });
    },
    listAllTasks({
      organizationId, ...opts
    }) {
      return this._makeRequest({
        path: `/organizations/${organizationId}/tasks`,
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, model, ...opts
    }) {
      let nextToken = false;
      let page = 0;

      do {
        params.page = ++page;
        delete params.page_start_id;
        if (nextToken) {
          params.page_start_id = nextToken;
        }
        const {
          pagination, [model]: data,
        } = await fn({
          params,
          ...opts,
        });

        for (const d of data) {
          yield d;
        }

        nextToken = pagination
          ? pagination.next_page_start_id
          : false;

      } while (nextToken);
    },
  },
};
