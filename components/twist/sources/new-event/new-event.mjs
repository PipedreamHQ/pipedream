import common from "../common.mjs";

export default {
  ...common,
  name: "New Event (Instant)",
  version: "0.0.2",
  type: "source",
  key: "twist-new-event",
  description: "Emits an event for any new updates in a workspace",
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
    eventType: {
      propDefinition: [
        common.props.twist,
        "eventType",
      ],
    },
  },
  methods: {
    ...common.methods,
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
