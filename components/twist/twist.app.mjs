import events from "./common/event-types.mjs";
import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "twist",
  propDefinitions: {
    workspace: {
      type: "string",
      label: "Workspace",
      description: "The workspace to watch for new events.",
      optional: true,
      async options() {
        const workspaces = await this.getWorkspaces({});
        return workspaces.map((workspace) => ({
          label: workspace.name,
          value: workspace.id,
        }));
      },
    },
    channel: {
      type: "string",
      label: "Channel",
      description: "The channel to watch for new events.",
      optional: true,
      async options({ workspace }) {
        if (!workspace)
          return [
            {
              label: "No Channels Found",
              value: "none",
            },
          ];
        const channels = await this.getChannels({
          workspace,
        });
        return channels.map((channel) => ({
          label: channel.name,
          value: channel.id,
        }));
      },
    },
    thread: {
      type: "string",
      label: "Thread",
      description: "The thread to watch for new events.",
      optional: true,
      async options({ channel }) {
        if (!channel)
          return [
            {
              label: "No Threads Found",
              value: "none",
            },
          ];
        const threads = await this.getThreads({
          channel,
        });
        return threads.map((thread) => ({
          label: thread.title,
          value: thread.id,
        }));
      },
    },
    conversation: {
      type: "string",
      label: "Conversation",
      description: "The conversation to watch for new messages.",
      optional: true,
      async options({ workspace }) {
        if (!workspace)
          return [
            {
              label: "No Conversations Found",
              value: "none",
            },
          ];
        const conversations = await this.getConversations({
          workspace,
        });
        return conversations.map((conversation) => ({
          label: conversation.title || `Conversation ID ${conversation.id}`,
          value: conversation.id,
        }));
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
    async _makeRequest(opts) {
      const {
        $ = this,
        endpoint,
        method = "GET",
        params,
        data,
      } = opts;
      const config = {
        method,
        url: `https://api.twist.com/api/v3/${endpoint}`,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      };
      if (params) config.params = params;
      if (data) config.data = data;
      return axios($, config);
    },
    async createHook(data) {
      return this._makeRequest({
        endpoint: "hooks/subscribe",
        method: "POST",
        data,
      });
    },
    async deleteHook(targetUrl) {
      return this._makeRequest({
        endpoint: "hooks/unsubscribe",
        method: "POST",
        data: {
          target_url: targetUrl,
        },
      });
    },
    async getWorkspaces(args = {}) {
      return this._makeRequest({
        endpoint: "workspaces/get",
        ...args,
      });
    },
    async getChannels({
      workspace, ...args
    }) {
      return this._makeRequest({
        endpoint: "channels/get",
        params: {
          workspace_id: workspace,
        },
        ...args,
      });
    },
    async getThreads({
      channel, ...args
    }) {
      return this._makeRequest({
        endpoint: "threads/get",
        params: {
          channel_id: channel,
        },
        ...args,
      });
    },
    async getConversations({
      workspace, ...args
    }) {
      return this._makeRequest({
        endpoint: "conversations/get",
        params: {
          workspace_id: workspace,
        },
        ...args,
      });
    },
    async getConversationMessages({
      conversation, ...args
    }) {
      return this._makeRequest({
        endpoint: "conversation_messages/get",
        params: {
          conversation_id: conversation,
        },
        ...args,
      });
    },
    async getComments({
      thread, ...args
    }) {
      return this._makeRequest({
        endpoint: "comments/get",
        params: {
          thread_id: thread,
        },
        ...args,
      });
    },
    async getGroups({
      workspace, ...args
    }) {
      return this._makeRequest({
        endpoint: "groups/get",
        params: {
          workspace_id: workspace,
        },
        ...args,
      });
    },
  },
};
