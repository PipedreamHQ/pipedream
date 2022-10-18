import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Comment (Instant)",
  version: "0.0.2",
  type: "source",
  key: "twist-new-comment-instant",
  description: "Emit new event for any new comment in a workspace [See the docs here](https://developer.twist.com/v3/#outgoing-webhook)",
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
    thread: {
      propDefinition: [
        common.props.twist,
        "thread",
        (c) => ({
          channel: c.channel,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    async getHistoricalEvents() {
      return this.twist.getComments({
        thread: this.thread,
      });
    },
    getHookActivationData() {
      return {
        target_url: this.http.endpoint,
        event: "comment_added",
        workspace_id: this.workspace,
        channel_id: this.channel,
        thread_id: this.thread,
      };
    },
    getMeta(body) {
      const {
        id,
        content,
        posted,
      } = body;
      return {
        id,
        summary: content,
        ts: Date.parse(posted),
      };
    },
  },
};
