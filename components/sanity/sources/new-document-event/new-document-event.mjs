import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "sanity-new-document-event",
  name: "New Document Event (Instant)",
  description: "Emit new event when a new document is created. [See the documentation](https://www.sanity.io/docs/http-reference/webhooks#createWebhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    on: {
      type: "string[]",
      label: "Type",
      description: "The type of document event(s)to listen for",
      options: [
        "create",
        "update",
        "delete",
      ],
    },
    includeDrafts: {
      type: "boolean",
      label: "Include Drafts",
      description: "Set to `true` to trigger on changes to draft documents",
      optional: true,
    },
    includeAllVersions: {
      type: "boolean",
      label: "Include All Versions",
      description: "Set `true` to trigger on changes to version documents",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getWebhookArgs() {
      return {
        type: "document",
        rule: {
          on: this.on,
        },
        includeDrafts: this.includeDrafts,
        includeAllVersions: this.includeAllVersions,
      };
    },
    generateMeta(event) {
      const ts = Date.parse(event._updatedAt);
      return {
        id: `${event._id}-${ts}`,
        summary: `New Event ID: ${event._id}`,
        ts,
      };
    },
  },
  sampleEmit,
};
