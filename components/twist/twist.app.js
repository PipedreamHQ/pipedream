const events = require("./event-types.js");
const axios = require("axios");

module.exports = {
  type: "app",
  app: "twist",
  propDefinitions: {
    workspace: {
      type: "string",
      label: "Workspace",
      description: "The workspace to watch for new events.",
      optional: true,
      async options() {
        const workspaces = await this.getWorkspaces();
        return workspaces.map((workspace) => {
          return {
            label: workspace.name,
            value: workspace.id,
          };
        });
      },
    },
    channel: {
      type: "string",
      label: "Channel",
      description: "The channel to watch for new events.",
      optional: true,
      async options(opts) {
        if (!opts.workspace)
          return [{ label: "No Channels Found", value: "none" }];
        const channels = await this.getChannels(opts.workspace);
        return channels.map((channel) => {
          return {
            label: channel.name,
            value: channel.id,
          };
        });
      },
    },
    thread: {
      type: "string",
      label: "Thread",
      description: "The thread to watch for new events.",
      optional: true,
      async options(opts) {
        if (!opts.channel)
          return [{ label: "No Threads Found", value: "none" }];
        const threads = await this.getThreads(opts.channel);
        return threads.map((thread) => {
          return {
            label: thread.title,
            value: thread.id,
          };
        });
      },
    },
    conversation: {
      type: "string",
      label: "Conversation",
      description: "The conversation to watch for new messages.",
      optional: true,
      async options(opts) {
        if (!opts.workspace)
          return [{ label: "No Conversations Found", value: "none" }];
        const conversations = await this.getConversations(opts.workspace);
        return conversations.map((conversation) => {
          return {
            label: conversation.title || `Conversation ID ${conversation.id}`,
            value: conversation.id,
          };
        });
      },
    },
    eventType: {
      type: "string",
      label: "Event Type",
      description: "Watch for the selected event type.",
      options: events,
    },
  },
  methods: {
    async _getBaseUrl() {
      return "https://api.twist.com/api/v3";
    },
    async _getHeaders() {
      return {
        Accept: "application/json",
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makePostRequest(endpoint, data = null) {
      config = {
        method: "POST",
        url: `${await this._getBaseUrl()}/${endpoint}`,
        headers: await this._getHeaders(),
        data,
      };
      return (await axios(config)).data;
    },
    async _makeGetRequest(endpoint, params = null) {
      config = {
        method: "GET",
        url: `${await this._getBaseUrl()}/${endpoint}`,
        headers: await this._getHeaders(),
        params,
      };
      return (await axios(config)).data;
    },
    async createHook(data) {
      return await this._makePostRequest("hooks/subscribe", data);
    },
    async deleteHook(target_url) {
      return await this._makePostRequest("hooks/unsubscribe", { target_url });
    },
    async getWorkspaces() {
      return await this._makeGetRequest("workspaces/get");
    },
    async getChannels(workspace_id) {
      return await this._makeGetRequest("channels/get", { workspace_id });
    },
    async getThreads(channel_id) {
      return await this._makeGetRequest("threads/get", { channel_id });
    },
    async getConversations(workspace_id) {
      return await this._makeGetRequest("conversations/get", { workspace_id });
    },
  },
};