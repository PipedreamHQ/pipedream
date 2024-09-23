import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "offlight",
  propDefinitions: {
    taskName: {
      type: "string",
      label: "Task Name",
      description: "The name of the task.",
    },
    taskNote: {
      type: "string",
      label: "Task Note",
      description: "A note about the task.",
      optional: true,
    },
    taskDeadline: {
      type: "string",
      label: "Task Deadline",
      description: "The deadline of the task (in ISO 8601 format).",
      optional: true,
    },
    identifier: {
      type: "string",
      label: "Identifier",
      description: "A unique identifier for the task.",
      optional: true,
    },
    sourceName: {
      type: "string",
      label: "Source Name",
      description: "The source name of the task.",
      optional: true,
    },
    sourceLink: {
      type: "string",
      label: "Source Link",
      description: "The source link of the task.",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://www.offlight.work";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-API-KEY": this.$auth.api_key,
        },
      });
    },
    async createTask({
      taskName,
      taskNote,
      taskDeadline,
      identifier,
      sourceName,
      sourceLink,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/zapier/task",
        data: {
          task_name: taskName,
          task_note: taskNote,
          task_deadline: taskDeadline,
          identifier: identifier,
          source_name: sourceName,
          source_link: sourceLink,
        },
      });
    },
    async getDoneTasks(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "GET",
        path: "/zapier/doneTasks",
      });
    },
    async paginate(fn, ...opts) {
      let results = [];
      let response;
      do {
        response = await fn(...opts);
        results = results.concat(response);
      } while (response.length);
      return results;
    },
  },
};
