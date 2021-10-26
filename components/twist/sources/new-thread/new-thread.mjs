import common from "../common.mjs";

export default {
  ...common,
  name: "New Thread (Instant)",
  version: "0.0.2",
  type: "source",
  key: "twist-new-thread-instant",
  description: "Emits an event for any new thread in a workspace",
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
