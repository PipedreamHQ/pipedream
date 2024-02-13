import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "2captcha",
  version: "0.0.{{ts}}",
  propDefinitions: {
    clientKey: {
      type: "string",
      label: "Client Key",
      description: "Your 2Captcha API key.",
    },
    task: {
      type: "object",
      label: "Task Object",
      description: "The task object for the captcha you want to solve.",
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the captcha task you want to get the result for.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.2captcha.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "POST",
        path,
        headers,
        data,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        data,
      });
    },
    async createTask({
      clientKey, task,
    }) {
      return this._makeRequest({
        path: "/createTask",
        data: {
          clientKey,
          task,
        },
      });
    },
    async getTaskResult({
      clientKey, taskId,
    }) {
      return this._makeRequest({
        path: "/getTaskResult",
        data: {
          clientKey,
          taskId,
        },
      });
    },
    async getBalance({ clientKey }) {
      return this._makeRequest({
        path: "/getBalance",
        data: {
          clientKey,
        },
      });
    },
    async checkTaskCompletion({
      clientKey, taskId,
    }) {
      const result = await this.getTaskResult({
        clientKey,
        taskId,
      });
      return result.status === "ready";
    },
    async checkBalanceChange({
      clientKey, initialBalance,
    }) {
      const { balance } = await this.getBalance({
        clientKey,
      });
      return balance !== initialBalance;
    },
  },
};
