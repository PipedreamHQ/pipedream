import common from "../common/webhook.mjs";

export default {
  ...common,
  name: "New Campaign Starts Sending (Instant)",
  key: "activecampaign-campaign-starts-sending",
  description: "Emit new event each time a campaign starts sending.",
  version: "0.0.7",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "sent",
      ];
    },
    getMeta(body) {
      const { date_time: dateTimeIso } = body;
      const ts = Date.parse(dateTimeIso);
      return {
        id: body["campaign[id]"],
        summary: body["campaign[name]"],
        ts,
      };
    },
  },
};
