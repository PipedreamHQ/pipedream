import common from "../common/base.mjs";

export default {
  ...common,
  name: "New Completed Campaign (Instant)",
  key: "unisender-new-completed-campaign",
  description: "Emit new event when all messages have been sent and analysis of the results is completed.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "campaign_status";
    },
    getMeta(item) {
      const {
        event_name, auth,
      } = item;

      const eventTime = new Date().getTime();

      return {
        id: auth + eventTime,
        summary: `New completed campaign: ${event_name}`,
        ts: eventTime,
      };
    },
    processEvent(body) {
      if (body.status == "completed") {
        const meta = this.getMeta(body);
        this.$emit(body, meta);
      }
    },
  },
};
