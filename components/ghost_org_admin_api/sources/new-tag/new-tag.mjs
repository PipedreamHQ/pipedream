import common from "../common-webhook.mjs";

export default {
  ...common,
  type: "source",
  key: "ghost_org_admin_api-new-tag",
  name: "Tag Added (Instant)",
  description: "Emit new event for each new tag created on a site.",
  version: "0.0.9",
  methods: {
    ...common.methods,
    getEvent() {
      return "tag.added";
    },
    generateMeta(body) {
      return ({
        id: body.tag.current.id,
        summary: body.tag.current.name,
        ts: Date.now(),
      });
    },
  },
};
