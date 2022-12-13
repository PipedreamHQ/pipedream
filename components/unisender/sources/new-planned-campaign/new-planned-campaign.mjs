import common from "../common/base.mjs";

export default {
  ...common,
  name: "New Planned Campaign (Instant)",
  key: "unisender-new-planned-campaign",
  description: "Emit new event when a new campaign is scheduled to be launched.",
  version: "0.0.2",
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
        summary: `New planned campaign: ${event_name}`,
        ts: eventTime,
      };
    },
    processEvent(body) {
      if (body.status === "waits_schedule") {
        const meta = this.getMeta(body);
        this.$emit(body, meta);
      }
    },
  },
};
