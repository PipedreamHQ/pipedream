import constants from "./common/constants.mjs";
import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ticktick",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "Project ID",
      default: "inbox",
      async options() {
        const projects = await this.listProjects();
        return projects.map((project) => ({
          label: project.name,
          value: project.id,
        }));
      },
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "ID of the task. Task IDs for task in the Inbox must be entered manually. When viewing the task, the task ID is the last part of the URL after `/tasks/`.",
      async options({ projectId }) {
        if (projectId === "inbox") {
          return [];
        }
        const tasks = await this.listTasks({
          projectId,
        });
        return tasks.map((task) => ({
          label: task.title,
          value: task.id,
        }));
      },
    },
  },
  methods: {
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _getUrl(path) {
      const {
        BASE_URL,
        ROOT_PATH,
        VERSION_PATH,
        HTTP_PROTOCOL,
      } = constants;
      return `${HTTP_PROTOCOL}${BASE_URL}${ROOT_PATH}${VERSION_PATH}${path}`;
    },
    async _makeRequest(args = {}) {
      const {
        $,
        path,
        ...otherArgs
      } = args;
      const config = {
        url: this._getUrl(path),
        headers: this._getHeaders(),
        ...otherArgs,
      };
      return axios($ ?? this, config);
    },
    createTask(args = {}) {
      return this._makeRequest({
        path: "/task",
        method: "post",
        ...args,
      });
    },
    updateTask(args, taskId) {
      return this._makeRequest({
        path: `/task/${taskId}`,
        method: "post",
        ...args,
      });
    },
    completeTask({
      taskId, projectId, ...args
    }) {
      return this._makeRequest({
        path: `/project/${projectId}/task/${taskId}/complete`,
        method: "post",
        ...args,
      });
    },
    listProjects(args = {}) {
      return this._makeRequest({
        path: "/project",
        ...args,
      });
    },
    async listTasks({
      projectId, ...args
    }) {
      const { tasks } = await this._makeRequest({
        path: `/project/${projectId}/data`,
        ...args,
      });
      return tasks;
    },
  },
};
