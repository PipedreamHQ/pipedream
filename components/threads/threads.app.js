// See API docs here:
// https://gist.github.com/gauravmk/c9263120b9309c24d6f14df6668e5326
const axios = require("axios");

module.exports = {
  type: "app",
  app: "threads",
  propDefinitions: {
    forumID: {
      type: "integer",
      label: "Forum ID",
      description:
        "The ID of the forum you want to post to. Navigate to your forum on the Threads website. The URL will be threads.com/${forum_id}",
    },
    title: {
      type: "string",
      label: "Thread Title",
      description:
        "The title of your thread (max 60 characters)",
    },
    body: {
      type: "string",
      label: "Thread Body",
      description:
        "The body of your thread. Supports Markdown",
    },
    threadID: {
      type: "string",
      label: "Thread ID",
      description:
        "Navigate to your thread on the Threads website. The URL will be threads.com/${thread_id}",
    },
  },
  methods: {
    _apiUrl() {
      return "https://threads.com/api/public";
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    async _makeRequest(opts) {
      if (!opts.headers) opts.headers = {};
      opts.headers["Content-Type"] = "application/json";
      opts.headers["Authorization"] = `Bearer ${this._apiKey()}`;
      opts.headers["user-agent"] = "@PipedreamHQ/pipedream v0.1";
      const { path } = opts;
      delete opts.path;
      opts.url = `${this._apiUrl()}${path[0] === "/"
        ? ""
        : "/"}${path}`;
      const {
        status,
        data,
      } = await axios({
        ...opts,
        validateStatus: () => true,
      });
      if (status >= 400) {
        throw new Error(JSON.stringify(data, null, 2));
      }
      return data;
    },
    async postThread({
      forumID, title, body,
    }) {
      return await this._makeRequest({
        path: "/postThread",
        method: "POST",
        data: {
          forumID,
          title,
          body,
        },
      });
    },
    async deleteThread({ threadID }) {
      return await this._makeRequest({
        path: "/deleteThread",
        method: "POST",
        data: {
          threadID,
        },
      });
    },
  },
};
