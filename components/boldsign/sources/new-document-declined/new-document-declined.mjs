import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import boldsign from "../../boldsign.app.mjs";

export default {
  key: "boldsign-new-document-declined",
  name: "New Document Declined",
  description: "Emit new event when a document is declined by a signer. [See the documentation](https://developers.boldsign.com)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    boldsign: {
      type: "app",
      app: "boldsign",
    },
    sentby: {
      propDefinition: [
        boldsign,
        "sentBy",
      ],
      optional: true,
    },
    recipients: {
      propDefinition: [
        boldsign,
        "recipients",
      ],
      optional: true,
    },
    searchkey: {
      propDefinition: [
        boldsign,
        "searchKey",
      ],
      optional: true,
    },
    labels: {
      propDefinition: [
        boldsign,
        "labels",
      ],
      optional: true,
    },
    brandids: {
      propDefinition: [
        boldsign,
        "brandIds",
      ],
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the document. Must be 'declined'.",
      default: "declined",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      const params = {
        status: this.status,
      };
      if (this.sentby) params.sentby = this.sentby;
      if (this.recipients) params.recipients = this.recipients;
      if (this.searchkey) params.searchkey = this.searchkey;
      if (this.labels) params.labels = this.labels;
      if (this.brandids) params.brandids = this.brandids;

      let page = 1;
      const perPage = 50;
      let emitted = 0;

      while (emitted < 50) {
        const documents = await this.boldsign._makeRequest({
          method: "GET",
          path: "/documents/list-documents",
          params: {
            ...params,
            page,
            perpage: Math.min(perPage - emitted, 50 - emitted),
          },
        });

        const docs = documents.result;
        if (!docs.length) break;

        for (const doc of docs.reverse()) {
          this.$emit(doc, {
            id: doc.documentId,
            summary: `Document Declined: ${doc.messageTitle}`,
            ts: doc.activityDate * 1000,
          });
          emitted++;
          if (emitted >= 50) break;
        }

        if (docs.length < perPage || emitted >= 50) break;
        page++;
      }
    },
    async activate() {
      // No activation steps needed for polling source
    },
    async deactivate() {
      // No deactivation steps needed for polling source
    },
  },
  async run() {
    const lastTs = this.db.get("lastTs") ?? 0;
    const params = {
      status: this.status,
      activityDate_gte: Math.floor(lastTs / 1000),
    };
    if (this.sentby) params.sentby = this.sentby;
    if (this.recipients) params.recipients = this.recipients;
    if (this.searchkey) params.searchkey = this.searchkey;
    if (this.labels) params.labels = this.labels;
    if (this.brandids) params.brandids = this.brandids;

    let page = 1;
    const perPage = 100;
    let maxTs = lastTs;

    while (true) {
      const documents = await this.boldsign._makeRequest({
        method: "GET",
        path: "/documents/list-documents",
        params: {
          ...params,
          page,
          perpage: perPage,
        },
      });

      const docs = documents.result;
      if (!docs.length) break;

      for (const doc of docs) {
        const docTs = doc.activityDate * 1000;
        if (docTs > maxTs) maxTs = docTs;
        this.$emit(doc, {
          id: doc.documentId,
          summary: `Document Declined: ${doc.messageTitle}`,
          ts: docTs,
        });
      }

      if (docs.length < perPage) break;
      page++;
    }

    this.db.set("lastTs", maxTs);
  },
};
