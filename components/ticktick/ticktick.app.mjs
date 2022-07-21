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
      description: "ID of task to complete",
      async options({ projectId }) {
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
    _getV2Headers(token = null) {
      const headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:95.0) Gecko/20100101 Firefox/95.0",
      };
      if (token) {
        headers.Cookie = `t=${token};`;
      }
      return headers;
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
    _getV2Url(path) {
      const {
        BASE_URL,
        ROOT_PATH_V2,
        VERSION_PATH_V2,
        HTTP_PROTOCOL,
      } = constants;
      return `${HTTP_PROTOCOL}${BASE_URL}${ROOT_PATH_V2}${VERSION_PATH_V2}${path}`;
    },
    async _makeRequest(args = {}) {
      const {
        $,
        method = "get",
        path,
        ...otherArgs
      } = args;
      const config = {
        method,
        url: this._getUrl(path),
        headers: this._getHeaders(),
        ...otherArgs,
      };
      return axios($ ?? this, config);
    },
    async createTask(args = {}) {
      return this._makeRequest({
        path: "/task",
        method: "post",
        ...args,
      });
    },
    async updateTask(args, taskId) {
      return this._makeRequest({
        path: `/task/${taskId}`,
        method: "post",
        ...args,
      });
    },
    async completeTask({
      taskId, projectId, ...args
    }) {
      return this._makeRequest({
        path: `/project/${projectId}/task/${taskId}/complete`,
        method: "post",
        ...args,
      });
    },
    async listTasks({
      $ = this, projectId,
    }) {
      // login user
      const { token } = await this.login($);
      await this.settings($, token);

      const tasks = (await this._makeRequest({
        $,
        url: this._getV2Url("/batch/check/0"),
        headers: this._getV2Headers(token),
      })).syncTaskBean?.update;

      if (projectId && projectId !== "inbox") {
        return tasks.filter((task) => task.projectId == projectId);
      }
      return tasks.filter((task) => task.projectId.includes("inbox"));
    },
    async listProjects($ = this) {
      // login user
      const { token } = await this.login($);
      await this.settings($, token);

      return this._makeRequest({
        $,
        url: this._getV2Url("/projects"),
        headers: this._getV2Headers(token),
      });
    },
    async login($) {
      return this._makeRequest({
        $,
        method: "post",
        url: this._getV2Url("/user/signin"),
        headers: this._getV2Headers(),
        params: {
          wc: true,
          remember: true,
        },
        data: {
          username: this.$auth.username,
          password: this.$auth.password,
        },
      });
    },
    async settings($, token) {
      return this._makeRequest({
        $,
        url: this._getV2Url("/user/preferences/settings"),
        headers: this._getV2Headers(token),
        params: {
          includeWeb: true,
        },
      });
    },
  },
};
