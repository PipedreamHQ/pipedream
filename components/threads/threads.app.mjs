// See API docs here:
// https://gist.github.com/gauravmk/c9263120b9309c24d6f14df6668e5326
import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "threads",
  propDefinitions: {
    channelID: {
      type: "string",
      label: "Channel ID",
      description: "Select the channel for your post",
      async options({ $ }) {
        const { result = [] } = await this.listChannels({
          $,
        });

        return result.map(({
          name: label, channelID: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    body: {
      type: "string",
      label: "Thread Body",
      description:
        "Compose your thread here, and include markdown if you'd like. See [here](https://github.com/ThreadsHQ/api-documentation#examples) for examples.",
    },
    threadID: {
      type: "string",
      label: "Thread ID",
      description:
        "To find your thread ID, open the relevant thread in your browser and copy the ID: https://trythreads.com/{thread_id}",
    },
    chatID: {
      type: "string",
      label: "Chat ID",
      description:
        "To find the chat ID, open the Threads chat in your browser and copy the ID: https://trythreads.com/messages/{your_chat_id}",
    },
  },
  methods: {
    _apiUrl() {
      return "https://trythreads.com/api/public";
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this._apiKey()}`,
        "user-agent": "@PipedreamHQ/pipedream v0.1",
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        headers: this._getHeaders(),
        url: `${this._apiUrl()}/${path}`,
        ...opts,
      };
      return await axios($, config);
    },
    async listChannels({ $ }) {
      return await this._makeRequest({
        $,
        path: "channels ",
        method: "POST",
      });
    },
    async postThread({
      $, ...data
    }) {
      return await this._makeRequest({
        $,
        path: "postThread",
        method: "POST",
        data,
      });
    },
    async deleteThread({
      $, ...data
    }) {
      return await this._makeRequest({
        $,
        path: "deleteThread",
        method: "POST",
        data,
      });
    },
    async postChatMessage({
      $, ...data
    }) {
      return await this._makeRequest({
        $,
        path: "postChatMessage",
        method: "POST",
        data,
      });
    },
  },
};
