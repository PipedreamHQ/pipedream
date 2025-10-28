import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "grabpenny",
  propDefinitions: {
    taskTypeId: {
      type: "integer",
      label: "Task Type ID",
      description: "ID of the task type",
      async options() {
        const { tasks } = await this.listTaskTypes();
        return tasks.map((task) => ({
          label: task.name,
          value: task.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://grabpenny.com/api/v1";
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      try {
        return await axios($, {
          url: `${this._baseUrl()}${path}`,
          headers: {
            Authorization: `Bearer ${this.$auth.api_key}`,
          },
          ...opts,
        });
      } catch (e) {
        if (e.response.status === 500) {
          throw new Error("Error occurred. Please verify that your account balance is sufficient to perform this action.");
        }
        throw e;
      }
    },
    listTaskTypes(args = {}) {
      return this._makeRequest({
        path: "/client/tasks/",
        ...args,
      });
    },
    createCampaign(args = {}) {
      return this._makeRequest({
        path: "/client/campaigns/create/",
        method: "POST",
        ...args,
      });
    },
  },
};
