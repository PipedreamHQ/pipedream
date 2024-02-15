import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "2captcha",
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
  },
  methods: {
    _baseUrl() {
      return "https://api.2captcha.com";
    },
    _headers() {
      return {
        "Content-Type": "application/json",
      };
    },
    _data(data) {
      return {
        clientKey: `${this.$auth.api_key}`,
        ...data,
      };
    },
    _makeRequest({
      $ = this, path, data = {}, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        data: this._data(data),
        ...opts,
      });
    },
    createTask(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/createTask",
        ...opts,
      });
    },
    getTaskResult(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/getTaskResult",
        ...opts,
      });
    },
    getBalance() {
      return this._makeRequest({
        method: "POST",
        path: "/getBalance",
      });
    },
  },
};
