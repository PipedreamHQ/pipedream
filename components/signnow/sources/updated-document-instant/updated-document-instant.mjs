import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "signnow-updated-document-instant",
  name: "Updated Document (Instant)",
  description: "Emit new event when a document has been updated. [See the documentation](https://docs.signnow.com/docs/signnow/webhooks/operations/create-a-api-v-2-event)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getEntityId() {
      const { id } = await this.app.getUserInfo();
      return id;
    },
    getEventName() {
      return events.USER_DOCUMENT_UPDATE;
    },
    generateMeta(resource) {
      const {
        document_id: documentId,
        document_name: documentName,
      } = resource.content;
      const { timestamp: ts } = resource.meta;
      return {
        id: `${documentId}-${ts}`,
        summary: `Updated Document: ${documentName}`,
        ts,
      };
    },
  },
  sampleEmit,
};
