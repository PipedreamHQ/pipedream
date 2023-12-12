import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "signaturely-signature-request-sent",
  name: "Signature Request Sent (Instant)",
  description: "Triggers when a new signature request has been sent. [See the documentation](https://docs.signaturely.com/#:~:text=Authentication-,Webhook,-Get%20a%20Free)",
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
          orderingKey: "updatedAt",
          orderingDirection: "DESC",
          searchType: constants.SEARCH_TYPE.DOCS,
          status: [
            constants.DOC_STATUS.COMPLETED,
          ],
        },
      };
    },
    getResourcesName() {
      return "items";
    },
    getEvents() {
      return [
        events.DOCUMENT_COMPLETED,
      ];
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.updatedAt);
      return {
        id: `${resource.id}-${ts}`,
        summary: `Request Sent: ${resource.title}`,
        ts,
      };
    },
  },
};
