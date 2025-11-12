import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "documerge-new-merged-document-instant",
  name: "New Merged Document (Instant)",
  description: "Emit new event when a merged document is created in documerge.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    documentIds: {
      propDefinition: [
        common.props.documerge,
        "documentId",
      ],
      type: "string[]",
      label: "Document IDs",
      description: "An array of document identifiers of the documents to watch",
    },
  },
  hooks: {
    async activate() {
      const deliveryMethodIds = {};
      for (const documentId of this.documentIds) {
        const { data: { id } } = await this.documerge.createDocumentDeliveryMethod({
          documentId,
          data: this.getWebhookSettings(),
        });
        deliveryMethodIds[documentId] = id;
      }
      this._setDeliveryMethodIds(deliveryMethodIds);
    },
    async deactivate() {
      const deliveryMethodIds = this._getDeliveryMethodIds();
      for (const documentId of this.documentIds) {
        await this.documerge.deleteDocumentDeliveryMethod({
          documentId,
          deliveryMethodId: deliveryMethodIds[documentId],
        });
      }
      this._setDeliveryMethodIds({});
    },
  },
  methods: {
    ...common.methods,
    getSummary(body) {
      return `Merged Document: ${body.file_name}`;
    },
  },
  sampleEmit,
};
