import common from "../common/webhook.mjs";

export default {
  ...common,
  name: "New Updated Contact (Instant)",
  key: "activecampaign-updated-contact",
  description: "Emit new event each time a contact is updated.",
  version: "0.0.7",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
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
