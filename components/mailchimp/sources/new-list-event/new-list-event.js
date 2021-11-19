const common = require("../common/http-based");

module.exports = {
  ...common,
  key: "mailchimp-new-list-event",
  name: "New List Event",
  description:
    "Emit new event when the following occurs on an audience list: a campaign is sent or cancelled, a subsciber is added, unsuscribed, has a profile update, or has the associated email address changed, or cleaned.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    listId: {
      type: "string",
      label: "Audience List Id",
      description:
        "The unique ID of the audience list you'd like to watch for new subscribers.",
    },
    events: {
      type: "string",
      label: "Events",
      description:
        "The events to be emitted, which will trigger the source being created.",
      default: "subscribe",
      options: [
        {
          label: "Subscribes",
          value: "subscribe",
        },
        {
          label: "Unsubscribes",
          value: "unsubscribe",
        },
        {
          label: "Profile Updates",
          value: "profile",
        },
        {
          label: "Cleaned Email",
          value: "cleaned",
        },
        {
          label: "Email Address Changes",
          value: "upemail",
        },
        {
          label: "Campaign sending status",
          value: "campaign",
        },
      ],
    },
  },
  methods: {
    ...common.methods,
    getEventName() {
      return [
        this.events,
      ];
    },
    getEventType() {
      return [
        this.events,
      ];
    },
    generateMeta(eventPayload) {
      const ts = +new Date(eventPayload.fired_at);
      return {
        id: eventPayload["data[id]"],
        summary: `New event "${eventPayload.type}" occurred`,
        ts,
      };
    },
  },
};
