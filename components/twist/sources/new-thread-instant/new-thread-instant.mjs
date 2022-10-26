import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Thread (Instant)",
  version: "0.0.3",
  type: "source",
  key: "twist-new-thread-instant",
  description: "Emit new event for any new thread in a workspace [See the docs here](https://developer.twist.com/v3/#outgoing-webhook)",
  props: {
    ...common.props,
    channel: {
      propDefinition: [
        common.props.twist,
        "channel",
        (c) => ({
          workspace: c.workspace,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    async getHistoricalEvents() {
      return this.twist.getThreads({
        channel: this.channel,
      });
    },
    getHookActivationData() {
      return {
        target_url: this.http.endpoint,
        event: "thread_added",
        workspace_id: this.workspace,
        channel_id: this.channel,
      };
    },
    getMeta(body) {
      const {
        id,
        title,
        posted,
      } = body;
      return {
        id,
        summary: title,
        ts: Date.parse(posted),
      };
    },
  },
};
