const axios = require("axios");
const events = [
  { label: "Workspace Added", value: `workspace_added` },
  { label: "Workspace Updated", value: `workspace_updated` },
  //  { label: "Workspace Deleted", value: `workspace_deleted` },
  { label: "Workspace User Added", value: `workspace_user_added` },
  { label: "Workspace User Updated", value: `workspace_user_updated` },
  //  { label: "Workspace User Removed", value: `workspace_user_removed` },
  { label: "Channel Added", value: `channel_added` },
  { label: "Channel Updated", value: `channel_updated` },
  //  { label: "Channel Deleted", value: `channel_deleted` },
  { label: "Channel User Added", value: `channel_user_added` },
  //  { label: "Channel User Updated", value: `channel_user_updated` },
  { label: "Channel User Removed", value: `channel_user_removed` },
  { label: "Thread Added", value: `thread_added` },
  { label: "Thread Updated", value: `thread_updated` },
  //  { label: "Thread Deleted", value: `thread_deleted` },
  { label: "Comment Added", value: `comment_added` },
  { label: "Comment Updated", value: `comment_updated` },
  //  { label: "Comment Deleted", value: `comment_deleted` },
  { label: "Message Added", value: `message_added` },
  { label: "Message Updated", value: `message_updated` },
  //  { label: "Message Deleted", value: `message_deleted` },
  //  { label: "Group Added", value: `group_added` },
  //  { label: "Group Updated", value: `group_updated` },
  //  { label: "Group Deleted", value: `group_deleted` },
  //  { label: "Group User Added", value: `group_user_added` },
  //  { label: "Group User Removed", value: `group_user_removed` },
];

module.exports = {
  type: "app",
  app: "twist",
  propDefinitions: {
    workspace: {
      type: "string",
      label: "Workspace",
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
    async createHook(target_url, event, params = null) {
      const data = {
        target_url,
        event,
      };
      const { workspace, channel, thread, conversation } = params;
      if (workspace) data.workspace_id = workspace;
      if (channel && channel !== "none") data.channel_id = channel;
      if (thread && thread !== "none") data.thread_id = thread;
      if (conversation && conversation !== "none")
        data.conversation_id = conversation;
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