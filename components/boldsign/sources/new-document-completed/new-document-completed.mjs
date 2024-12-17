import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import boldsign from "../../boldsign.app.mjs";

export default {
  key: "boldsign-new-document-completed",
  name: "BoldSign New Document Completed",
  description: "Emit a new event when a document is completed by all the signers. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    boldsign,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    status: {
      type: "string",
      label: "Status",
      description: "Status of the document.",
      default: "completed",
    },
    sentBy: {
      propDefinition: [
        "boldsign",
        "sentBy",
      ],
      optional: true,
    },
    recipients: {
      propDefinition: [
        "boldsign",
        "recipients",
      ],
      optional: true,
    },
    searchKey: {
      propDefinition: [
        "boldsign",
        "searchKey",
      ],
      optional: true,
    },
    labels: {
      propDefinition: [
        "boldsign",
        "labels",
      ],
      optional: true,
    },
    brandIds: {
      propDefinition: [
        "boldsign",
        "brandIds",
      ],
      optional: true,
    },
  },
  methods: {
    async listDocuments() {
      const params = {
        status: this.status,
        sentby: this.sentBy,
        recipients: this.recipients,
        searchkey: this.searchKey,
        labels: this.labels,
        brandids: this.brandIds,
        perpage: 50,
      };
      Object.keys(params).forEach((key) => params[key] === undefined && delete params[key]);
      const response = await this.boldsign._makeRequest({
        path: "/documents/list-documents",
        method: "GET",
        params,
      });
      return response.result;
    },
    getCursorKey() {
      return "lastRunTs";
    },
  },
  hooks: {
    async deploy() {
      const documents = await this.listDocuments();
      const sortedDocuments = documents.sort((a, b) => b.activityDate - a.activityDate).slice(0, 50);
      for (const document of sortedDocuments) {
        this.$emit(document, {
          id: document.documentId || document.activityDate,
          summary: `Document Completed: ${document.messageTitle}`,
          ts: document.activityDate * 1000,
        });
      }
      if (sortedDocuments.length > 0) {
        const latestDocument = sortedDocuments[0];
        this.db.set(this.getCursorKey(), latestDocument.activityDate);
      }
    },
    async activate() {
      // No activation logic required
    },
    async deactivate() {
      // No deactivation logic required
    },
  },
  async run() {
    const lastRunTs = (await this.db.get(this.getCursorKey())) || 0;
    const params = {
      status: this.status,
      sentby: this.sentBy,
      recipients: this.recipients,
      searchkey: this.searchKey,
      labels: this.labels,
      brandids: this.brandIds,
      since: lastRunTs,
      perpage: 50,
    };
    Object.keys(params).forEach((key) => params[key] === undefined && delete params[key]);
    const documents = await this.boldsign._makeRequest({
      path: "/documents/list-documents",
      method: "GET",
      params,
    }).then((response) => response.result);

    const newDocuments = documents.filter((doc) => doc.activityDate > lastRunTs);
    for (const document of newDocuments) {
      this.$emit(document, {
        id: document.documentId || document.activityDate,
        summary: `Document Completed: ${document.messageTitle}`,
        ts: document.activityDate
          ? document.activityDate * 1000
          : Date.now(),
      });
    }

    if (newDocuments.length > 0) {
      const latestDocument = newDocuments.reduce((prev, current) => (prev.activityDate > current.activityDate)
        ? prev
        : current);
      this.db.set(this.getCursorKey(), latestDocument.activityDate);
    }
  },
};
