import common from "../common/webhook.mjs";

export default {
  ...common,
  name: "New Deal Added or Updated (Instant)",
  key: "activecampaign-new-or-updated-deal",
  description: "Emit new event each time a deal is added or updated.",
  version: "0.0.7",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "deal_add",
        "deal_update",
      ];
    },
    getMeta(body) {
      const { date_time: dateTimeIso } = body;
      const ts = Date.parse(dateTimeIso);
      return {
        id: `${body["deal[id]"]}${new Date(body.date_time).getTime()}`,
        summary: body["deal[title]"],
        ts,
      };
    },
  },
};
