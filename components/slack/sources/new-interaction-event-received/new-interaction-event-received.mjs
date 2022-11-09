import common from "../common/base.mjs";

export default {
  name: "New Interaction Events",
  version: "0.0.1",
  key: "slack-new-interaction-event-received",
  description:
    "Emit new events on new Slack [interactivity events](https://api.slack.com/interactivity) sourced from [Block Kit interactive elements](https://api.slack.com/interactivity/components), [Slash commands](https://api.slack.com/interactivity/slash-commands), or [Shortcuts](https://api.slack.com/interactivity/shortcuts).",
  type: "source",
  props: {
    ...common.props,
    action_ids: {
      type: "string[]",
      label: "Action IDs",
      description:
        "Filter interaction events by specific `action_id`'s to subscribe for new interaction events. If none selected, all `action_ids` will emit new events.",
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
      description:
        "Filter interaction events by one or more channels. If none selected, any interaction event in any channel will emit new events.",
      optional: true,
      default: [],
    },
    // eslint-disable-next-line pipedream/props-description,pipedream/props-label
    slackApphook: {
      type: "$.interface.apphook",
      appProp: "slack",
      /**
       * Subscribes to potentially 4 different events:
       * `interaction_events` - all interaction events on the authenticated account
       * `interaction_events:${action_id}` - all interaction events with a specific given action_id
       * `interaction_events:${channel_id}` - all interaction events within a specific channel
       * `interaction_events:${channel_id}:${action_id}` - action_id within a specific channel
       * @returns string[]
       */
      async eventNames() {
        // start with action_ids, since they can be the most specific
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

        // if no action_ids are specified, move down to channels
        const channel_events = this.conversations.map(
          (channel) => `interaction_events:${channel}`,
        );

        if (channel_events.length > 0) return channel_events;

        // if not specific action_ids or channels are specified, subscribe to all events
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
