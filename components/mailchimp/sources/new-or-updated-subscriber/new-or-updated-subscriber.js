const common = require("../common/http-based");

module.exports = {
  ...common,
  key: "mailchimp-new-or-updated-subscriber",
  name: "New Or Updated Subscriber",
  description:
    "Emit new event when a subscriber is added or updated (on profile, or email address change) in an audience list.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
  },
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        "subscribe",
        "profile",
        "upemail",
      ];
    },
    generateMeta(eventPayload) {
      const ts = +new Date(eventPayload.fired_at);
      let summary;
      if ([
        "subscribe",
      ].includes(eventPayload.type)) {
        summary = `${eventPayload["data[email]"]} subscribed to list ${eventPayload["data[list_id]"]}`;
      } else if ([
        "profile",
      ].includes(eventPayload.type)) {
        summary = `${eventPayload["data[email]"]}'s profile was updated`;
      } else if ([
        "upemail",
      ].includes(eventPayload.type)) {
        summary = `${eventPayload["data[old_email]"]}'s email address changed to ${eventPayload["data[new_email]"]}`;
      } else {
        console.log("Unexpected trigger found, skipping emit");
        return;
      }
      return {
        id: eventPayload["data[id]"],
        summary,
        ts,
      };
    },
  },
};
