import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "signaturely-document-sent",
  name: "Document Sent (Instant)",
  description: "Triggers when a document is sent. [See the documentation](https://docs.signaturely.com/#:~:text=Authentication-,Webhook,-Get%20a%20Free)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourcesFn() {
      return this.app.listDocuments;
    },
    getResourcesFnArgs() {
      return {
        params: {
          orderingKey: "createdAt",
          orderingDirection: "DESC",
          searchType: constants.SEARCH_TYPE.DOCS,
          status: [
            constants.DOC_STATUS.AWAITING,
          ],
        },
      };
    },
    getResourcesName() {
      return "items";
    },
    getEvents() {
      return [
        events.DOCUMENT_SENT,
      ];
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `Document Sent: ${resource.title}`,
        ts: Date.parse(resource.createdAt),
      };
    },
  },
};
