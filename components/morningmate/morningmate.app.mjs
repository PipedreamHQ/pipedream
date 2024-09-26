import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "morningmate",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project",
      async options() {
        const { response: { data: { projects } } } = await this.listProjects();
        if (!projects?.length) {
          return [];
        }
        return projects.map(({
          projectId: value, title: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user",
      async options() {
        const { response: { data: { employees } } } = await this.listEmployees();
        if (!employees?.length) {
          return [];
        }
        return employees.map(({
          userId: value, userName: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    botId: {
      type: "string",
      label: "Bot ID",
      description: "The ID of the bot",
      async options() {
        const { response: { data: { bots } } } = await this.listBots();
        if (!bots?.length) {
          return [];
        }
        return bots.map(({
          botId: value, botName: label,
        }) => ({
          value,
          label,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.morningmate.com/v1";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "x-flow-api-key": `${this.$auth.api_key}`,
          "Content-Type": "application/json",
        },
      });
    },
    listProjects(opts = {}) {
      return this._makeRequest({
        path: "/projects",
        ...opts,
      });
    },
    listEmployees(opts = {}) {
      return this._makeRequest({
        path: "/employees",
        ...opts,
      });
    },
    listBots(opts = {}) {
      return this._makeRequest({
        path: "/bots",
        ...opts,
      });
    },
    sendNotification({
      botId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/bots/${botId}/notifications`,
        ...opts,
      });
    },
    createSchedule({
      projectId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/posts/projects/${projectId}/schedules`,
        ...opts,
      });
    },
    createTask({
      projectId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/posts/projects/${projectId}/tasks`,
        ...opts,
      });
    },
  },
};
