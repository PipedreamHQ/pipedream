import common from "../common/webhook.mjs";

export default {
  ...common,
  name: "New or Updated Contact (Instant)",
  key: "activecampaign-new-or-updated-contact",
  description: "Emit new event each time a contact is added or updated.",
  version: "0.0.7",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "subscribe",
        "update",
      ];
    },
    getMeta(body) {
      const { date_time: dateTimeIso } = body;
      const ts = Date.parse(dateTimeIso);
      return {
        id: `${body["contact[id]"]}${new Date(body.date_time).getTime()}`,
        summary: body["contact[email]"],
        ts,
      };
    },
  },
};
