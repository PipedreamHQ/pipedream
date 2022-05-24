const github = require("../../github.app.js");
const common = require("../common-webhook.js");

module.exports = {
  ...common,
  key: "github-custom-events",
  name: "Custom Webhook Events",
  description:
    "Emit new events of selected types",
  type: "source",
  version: "0.0.7",
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
    generateMeta(data, id) {
      const ts = Date.now();
      return {
        id,
        summary: `${data.action} event by ${data.sender.login}`,
        ts,
      };
    },
    emitEvent(body, id) {
      const meta = this.generateMeta(body, id);
      this.$emit(body, meta);
    },
  },
};
