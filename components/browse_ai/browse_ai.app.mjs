import { axios } from "@pipedream/platform";

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
        return robots.map((robot) => ({
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
      return "https://api.browse.ai";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async getRobots() {
      return this._makeRequest({
        path: "/v1/robots",
      });
    },
    async runRobot({
      robotId, inputParameters,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/v1/robots/${robotId}/run`,
        data: inputParameters,
      });
    },
    async getTaskStatus({ taskId }) {
      return this._makeRequest({
        path: `/v1/tasks/${taskId}/status`,
      });
    },
  },
};
