import common from "../common-webhook.mjs";

export default {
  ...common,
  type: "source",
  key: "ghost_org_admin_api-member-deleted",
  name: "Member Deleted (Instant)",
  description: "Emit new event each time a member is deleted from a site.",
  version: "0.0.9",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "member.deleted";
    },
    generateMeta(body) {
      return ({
        id: body.member.previous.id,
        summary: body.member.previous.name,
        ts: Date.now(),
      });
    },
  },
};
