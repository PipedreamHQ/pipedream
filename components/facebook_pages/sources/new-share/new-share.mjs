import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "facebook_pages-new-share",
  name: "New Share of Post",
  description: "Emit new event when someone shares a post from your Facebook Page.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFields() {
      return [
        "feed",
      ];
    },
    generateMeta(data) {
      const {
        post_id, share_id, from, created_time,
      } = data;
      const ts = created_time
        ? created_time * 1000
        : Date.now();
      const id = share_id || `share-${post_id}-${ts}`;

      let summary = "New share";
      if (from?.name) {
        summary = `${from.name} shared a post`;
      }

      return {
        id,
        summary,
        ts,
      };
    },
    processEvent(change) {
      if (change.field === "feed" && change.value) {
        const {
          item, verb,
        } = change.value;
        // Only emit events for shares
        if (item === "share" && verb === "add") {
          return change.value;
        }
      }
      return null;
    },
  },
};
