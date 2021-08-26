const github = require("../../github.app.js");
const common = require("../common-webhook.js");

module.exports = {
  ...common,
  key: "github-custom-events",
  name: "Custom Webhook Events",
  description:
    "Subscribe to one or more event types and emit an event on each webhook request",
  version: "0.0.4",
  props: {
    ...common.props,
    events: {
      propDefinition: [
        github,
        "events",
      ],
    },
  },
  dedupe: "unique",
  methods: {
    getEventNames() {
      return this.events;
    },
    generateMeta(data) {
      const ts = Date.now();
      return {
        id: `${data.repository.id}${ts}`,
        summary: `${data.action} event by ${data.sender.login}`,
        ts,
      };
    },
    emitEvent(body) {
      const meta = this.generateMeta(body);
      this.$emit(body, meta);
    },
  },
};
