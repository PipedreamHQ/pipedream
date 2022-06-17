import constants from "./common/constants.mjs";
import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ticktick",
  propDefinitions: {},
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
        method = "get",
        path,
        params,
        data,
      } = args;
      const config = {
        method,
        url: this._getUrl(path),
        headers: this._getHeaders(),
        params,
        data,
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
  },
};
