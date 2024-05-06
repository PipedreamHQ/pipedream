import cradlAi from "../../cradl_ai.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "cradl_ai-new-document-parsing-completed-instant",
  name: "New Document Parsing Completed (Instant)",
  description: "Emits an event when a document processing flow has completed.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    cradlAi,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    documentId: {
      propDefinition: [
        cradlAi,
        "documentId",
      ],
    },
    userId: {
      propDefinition: [
        cradlAi,
        "userId",
      ],
      optional: true,
    },
    processingFlowId: {
      propDefinition: [
        cradlAi,
        "processingFlowId",
      ],
      optional: true,
    },
  },
  methods: {
    _getEvent() {
      return this.db.get("event") ?? {};
    },
    _setEvent(event) {
      this.db.set("event", event);
    },
  },
  async run() {
    const event = await this.cradlAi.emitDocumentProcessingEvent({
      data: {
        documentId: this.documentId,
        userId: this.userId,
        processingFlowId: this.processingFlowId,
      },
    });

    if (event.id !== this._getEvent().id) {
      this._setEvent(event);
      this.$emit(event, {
        id: event.id,
        summary: `New Document Processing Event: ${event.id}`,
        ts: Date.now(),
      });
    }
  },
};
