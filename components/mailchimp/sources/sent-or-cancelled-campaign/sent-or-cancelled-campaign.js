const common = require("../common-webhook");
const { mailchimp } = common.props;

module.exports = {
  ...common,
  key: "mailchimp-sent-or-cancelled-campaign",
  name: "Sent Or Cancelled Campaign",
  description:
    "Emit an event when a campaign is sent or cancelled.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    listId: {
      type: "string",
      label: "Audience List Id",
      description: "The unique ID of the audience list you'd like to watch for campaigns, new or sent."
    },
    server: { propDefinition: [mailchimp, "server"] },
  },
  methods: {
    ...common.methods,
    getEventName() {
      return ["campaign"];
    },
    getEventType() {
      return ["campaign"];
    },
    generateMeta(eventPayload) {
      const ts = +new Date(eventPayload.fired_at);
      return {
        id: `${eventPayload["data[id]"]}`,
        summary: `Campaign was ${eventPayload["data[status]"]}`,
        ts,
      };
    },
  },
};
