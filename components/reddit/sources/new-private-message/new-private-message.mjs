import common from "../common.mjs";

export default {
  ...common,
  type: "source",
  key: "reddit-new-private-message",
  name: "New Private Message",
  description: "Emit new event each time you receive a new private message.",
  version: "0.0.2",
  dedupe: "unique",
  hooks: {
    async deploy() {
      // Emits sample events on the first run during deploy.
      var privateMessages = await this.reddit.getPrivateMessages({
        params: {
          limit: 20,
        },
      });

      let { children: messages = [] } = privateMessages.data;
      if (messages.length === 0) {
        console.log("No data available, skipping iteration");
        return;
      }

      const { id = this._getBefore() } = messages[0].data;
      this._setBefore(id);
      messages.reverse().forEach(this.emitRedditEvent);
    },
  },
  methods: {
    ...common.methods,
    generateEventMetadata(redditEvent) {
      return {
        id: redditEvent.data.id,
        summary: redditEvent.data.body,
        ts: redditEvent.data.created,
      };
    },
  },
  async run() {
    let privateMessages;
    do {
      privateMessages = await this.reddit.getPrivateMessages({
        params: {
          before: `t4_${this._getBefore()}`,
          limit: 2,
        },
      });

      const { children: messages = [] } = privateMessages.data;
      if (messages.length === 0) {
        console.log("No data available, skipping iteration");
        break;
      }
      const { id } = messages[0].data;
      this._setBefore(id);

      messages.reverse().forEach((message) => {
        this.emitRedditEvent(message);
      });
    } while (privateMessages);
  },
};
