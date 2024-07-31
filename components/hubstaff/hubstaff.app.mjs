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
      async options() {
        const { organizations } = await this.listOrganizations();
        return organizations.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project",
      async options({ organizationId }) {
        const { projects } = await this.listProjects({
          organizationId,
        });
        return projects.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task",
      async options({
        organizationId, projectId,
      }) {
        const { tasks } = await this.listTasks({
          organizationId,
          projectId,
        });
        return tasks.map(({
          id: value, summary: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    userIds: {
      type: "string[]",
      label: "User IDs",
      description: "List of user IDs",
      async options({
        organizationId, projectId,
      }) {
        const {
          members, users,
        } = await this.listUsers({
          organizationId,
          projectId,
          params: {
            include: [
              "users",
            ],
          },
        });

        return members.map(({ user_id: value }) => ({
          label: users.find((user) => user.user_id = value).name,
          value,
        }));
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
        params.page_start_id = nextToken;
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
