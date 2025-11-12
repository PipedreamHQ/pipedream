import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "docnify-new-document-signed",
  name: "New Document Signed",
  description: "Emit new event when a document is signed by a recipient",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTsField() {
      return "updatedAt";
    },
    async isRelevant(doc, lastTs) {
      const { recipients } = await this.docnify.getDocument({
        documentId: doc.id,
      });
      const recentlySigned = recipients
        ?.filter(({ signedAt }) => signedAt && Date.parse(signedAt) >= lastTs);
      return !!recentlySigned?.length;
    },
    async generateMeta(doc) {
      const { recipients } = await this.docnify.getDocument({
        documentId: doc.id,
      });
      const signedAts = recipients?.map(({ signedAt }) => Date.parse(signedAt));
      const ts = Math.max(...signedAts);
      return {
        id: `${doc.id}-${ts}`,
        summary: `New Document Signed: ${doc.id}`,
        ts,
      };
    },
  },
  sampleEmit,
};
