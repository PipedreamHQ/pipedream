import common from "../common/common.mjs";
import twist from "../../twist.app.mjs";

export default {
  ...common,
  name: "New Event (Instant)",
  version: "0.0.2",
  type: "source",
  key: "twist-new-event-instant",
  description: "Emit new event for any new updates in a workspace [See the docs here](https://developer.twist.com/v3/#outgoing-webhook)",
  props: {
    twist,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    eventType: {
      propDefinition: [
        twist,
        "eventType",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {
      workspace: {
        type: "string",
        label: "Workspace",
        description: "The workspace to watch for new events.",
        options: async () => {
          const workspaces = await this.twist.getWorkspaces({});
          return workspaces.map((workspace) => ({
            label: workspace.name,
            value: workspace.id,
          }));
        },
        optional: this.eventType.includes("workspace"),
      },
    };
    if (this.eventType.includes("message")) {
      props.conversation = {
        type: "string",
        label: "Conversation",
        description: "The conversation to watch for new messages.",
        options: async () => {
          if (!this.workspace) {
            return [
              {
                label: "No Conversations Found",
                value: "none",
              },
            ];
          }
          const conversations = await this.twist.getConversations({
            workspace: this.workspace,
          });
          return conversations.map((conversation) => ({
            label: conversation.title || `Conversation ID ${conversation.id}`,
            value: conversation.id,
          }));
        },
      };
    }
    if (this.eventType.includes("thread") || this.eventType.includes("comment")) {
      props.channel = {
        type: "string",
        label: "Channel",
        description: "The channel to watch for new events.",
        options: async () => {
          if (!this.workspace) {
            return [
              {
                label: "No Channels Found",
                value: "none",
              },
            ];
          }
          const channels = await this.twist.getChannels({
            workspace: this.workspace,
          });
          return channels.map((channel) => ({
            label: channel.name,
            value: channel.id,
          }));
        },
      };
    }
    if (this.eventType.includes("comment")) {
      props.thread = {
        type: "string",
        label: "Thread",
        description: "The thread to watch for new events.",
        options: async () => {
          if (!this.channel) {
            return [
              {
                label: "No Threads Found",
                value: "none",
              },
            ];
          }
          const threads = await this.twist.getThreads({
            channel: this.channel,
          });
          return threads.map((thread) => ({
            label: thread.title,
            value: thread.id,
          }));
        },
      };
    }
    return props;
  },
  methods: {
    ...common.methods,
    async getHistoricalEvents() {
      if (this.eventType.includes("workspace")) {
        return this.twist.getWorkspaces();
      }
      if (this.eventType.includes("channel")) {
        return this.twist.getChannels({
          workspace: this.workspace,
        });
      }
      if (this.eventType.includes("thread")) {
        return this.twist.getThreads({
          channel: this.channel,
        });
      }
      if (this.eventType.includes("comment")) {
        return this.twist.getComments({
          thread: this.thread,
        });
      }
      if (this.eventType.includes("message")) {
        return this.twist.getConversatioMessages({
          conversation: this.conversation,
        });
      }
      if (this.eventType.includes("group")) {
        return this.twist.getGroups({
          workspace: this.workspace,
        });
      }
    },
    getHookActivationData() {
      return {
        target_url: this.http.endpoint,
        event: this.eventType,
        workspace_id: this.workspace,
        channel_id: this.channel,
        thread_id: this.thread,
      };
    },
    getMeta(body) {
      const {
        id,
        name: summary = "New Event",
        created = new Date(),
      } = body;
      const ts = Date.parse(created);
      return {
        id: `${id}${ts}`,
        summary,
        ts,
      };
    },
  },
};
