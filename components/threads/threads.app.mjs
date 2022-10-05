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
      description:
        "This is ID of the channel you want to post to. An easy way to find a channelID for a channel is to navigate to that channel on the Threads website. The URL will be trythreads.com/<your_channel_id>",
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
        "The body of your thread. Supports Markdown",
    },
    threadID: {
      type: "string",
      label: "Thread ID",
      description:
        "Navigate to your thread on the Threads website. The URL will be threads.com/${thread_id}",
    },
    chatID: {
      type: "string",
      label: "Chat ID",
      description:
        "This is ID of the chat you want to post to. An easy way to find a chatID for a chat is to navigate to that chat on the Threads website. The URL will be trythreads.com/messages/<your_chat_id>",
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
