import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "browse_ai",
  propDefinitions: {
    robotId: {
      type: "string",
      label: "Robot ID",
      description: "Select the robot to run",
      async options() {
        const { robots } = await this.getRobots();
        return robots.items.map((robot) => ({
          value: robot.id,
          label: robot.name,
        }));
      },
    },
    inputParameters: {
      type: "object",
      label: "Input Parameters",
      description: "Custom input parameters for the robot",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      const config = {
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
        ...args,
      };
      console.log(config);
      return axios($, config);
    },
    post(args = {}) {
      return this._makeRequest({
        method: "post",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "delete",
        ...args,
      });
    },
    getRobots(args = {}) {
      return this._makeRequest({
        path: "/robots",
        ...args,
      });
    },
    getRobotTasks({
      robotId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/robots/${robotId}/tasks`,
        ...args,
      });
    },
  },
};
