import common from "../common/base.mjs";

export default {
  name: "New Interactions",
  version: "0.0.1",
  key: "slack-new-interactions",
  description: "Emit new events on each new interactions",
  type: "source",
  props: {
    ...common.props,
    action_ids: {
      type: "string[]",
      label: "Action IDs",
      description:
        "A list of specific `action_id`'s to subscribe for new interaction events.",
      optional: true,
      default: [],
    },
    conversations: {
      propDefinition: [
        common.props.slack,
        "conversation",
      ],
      type: "string[]",
      label: "Channels",
      description: "Select one or more channels to monitor for new messages.",
      optional: true,
      default: [],
    },
    slackApphook: {
      type: "$.interface.apphook",
      appProp: "slack",
      async eventNames() {
        const action_events = this.action_ids.reduce((carry, action_id) => {
          // if channels are provided, spread them
          if (this.conversations && this.conversations.length > 0) {
            return [
              ...carry,
              ...this.conversations.map(
                (channel) => `interaction_events:${channel}:${action_id}`,
              ),
            ];
          }

          return [
            ...carry,
            `interaction_events:${action_id}`,
          ];
        }, []);

        if (action_events.length > 0) return action_events;

        const channel_events = this.conversations.map(
          (channel) => `interaction_events:${channel}`,
        );

        if (channel_events.length > 0) return channel_events;

        // if not specific events are
        return [
          "interaction_events",
        ];
      },
    },
  },
  methods: {},
  async run(event) {
    this.$emit(
      {
        event,
      },
      {
        summary: `New interaction event${
          event?.channel?.id
            ? ` in channel ${event.channel.id}`
            : ""
        }${
          event.actions?.length > 0
            ? ` from action_ids ${event.actions
              .map((action) => action.action_id)
              .join(", ")}`
            : ""
        }`,
        ts: Date.now(),
      },
    );
  },
};
