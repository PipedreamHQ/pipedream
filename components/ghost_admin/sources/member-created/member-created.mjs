import common from "../common-webhook.mjs";

export default {
  ...common,
  type: "source",
  key: "ghost_admin-member-created",
  name: "New Member Created (Instant)",
  description: "Emit new event for each new member added to a site.",
  version: "0.0.4",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "member.added";
    },
    generateMeta(body) {
      return ({
        id: body.member.current.id,
        summary: body.member.current.name,
        ts: Date.now(),
      });
    },
  },
};
