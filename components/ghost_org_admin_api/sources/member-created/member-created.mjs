import common from "../common-webhook.mjs";

export default {
  ...common,
  type: "source",
  key: "ghost_org_admin_api-member-created",
  name: "New Member Created (Instant)",
  description: "Emit new event for each new member added to a site.",
  version: "0.0.10",
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
