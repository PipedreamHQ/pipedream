import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "facebook_pages-page-updated",
  name: "Page Updated",
  description: "Emit new event when your Facebook Page information is updated (such as description, hours, location, etc.).",
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
        item, verb, created_time,
      } = data;
      const ts = created_time
        ? created_time * 1000
        : Date.now();
      const id = `page-update-${ts}`;

      let summary = "Page updated";
      if (item === "status" && verb === "add") {
        summary = "Page status updated";
        if (data.message) {
          const preview = data.message.substring(0, 50);
          summary += `: ${preview}${data.message.length > 50
            ? "..."
            : ""}`;
        }
      } else if (verb === "edited") {
        summary = `Page ${item} edited`;
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
        // Emit events for page updates (status updates, edits, etc.)
        if ((item === "status" && verb === "add") || verb === "edited") {
          return change.value;
        }
      }
      return null;
    },
  },
};
