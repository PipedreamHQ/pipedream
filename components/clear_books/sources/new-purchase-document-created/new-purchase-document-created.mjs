import common from "../common/base.mjs";

export default {
  ...common,
  key: "clear_books-new-purchase-document-created",
  name: "New Purchase Document Created",
  description: "Emit new event when a new purchase document is created.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    purchaseType: {
      propDefinition: [
        common.props.clearBooks,
        "purchaseType",
      ],
    },
  },
  methods: {
    ...common.methods,
    getFn() {
      return this.clearBooks.listPurchaseDocuments;
    },
    getArgs() {
      return {
        type: this.purchaseType,
      };
    },
    generateMeta(purchaseDocument) {
      return {
        id: purchaseDocument.id,
        summary: `New Purchase Document with ID: ${purchaseDocument.id}`,
        ts: Date.now(),
      };
    },
  },
};
