import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "ironclad-new-workflow-document-event-instant",
  name: "New Workflow Document Event (Instant)",
  description: "Emit new event when a workflow document event is freshly established.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "workflow_documents_added",
        "workflow_documents_removed",
        "workflow_documents_updated",
        "workflow_documents_renamed",
        "workflow_document_edited",
      ];
    },
  },
  sampleEmit,
};
