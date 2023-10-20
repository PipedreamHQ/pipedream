import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "holded-invoice-created",
  name: "New Invoice Created",
  description: "Emit new event when invoice is generated in Holded. [See the docs](https://developers.holded.com/reference/list-documents-1).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.listDocuments;
    },
    getResourceFnArgs() {
      return {
        docType: constants.DOC_TYPE.INVOICE,
        params: {
          sort: "created-desc",
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Invoice: ${resource.id}`,
        ts: Date.now(),
      };
    },
  },
};
