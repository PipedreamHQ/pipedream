import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import boldsign from "../../boldsign.app.mjs";

export default {
  key: "boldsign-new-document-sent",
  name: "New Document Sent",
  description: "Emit a new event when a document is sent to a signer. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    boldsign: {
      type: "app",
      app: "boldsign",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    sentBy: {
      propDefinition: [
        "boldsign",
        "sentBy",
      ],
      optional: true,
    },
    recipients: {
      type: "string[]",
      label: "Recipients",
      description: "Recipients of the document.",
      optional: true,
    },
    searchKey: {
      type: "string",
      label: "Search Key",
      description: "Search key for documents.",
      optional: true,
    },
    labels: {
      type: "string[]",
      label: "Labels",
      description: "Labels for categorizing documents.",
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
    getLastTimestamp() {
      return this.db.get("lastTimestamp") ?? 0;
    },
    setLastTimestamp(timestamp) {
      this.db.set("lastTimestamp", timestamp);
    },
    buildQueryParams() {
      const params = {
        transmitType: "sent",
        perpage: 50,
        sort: "activityDate",
        order: "DESC",
      };
      if (this.sentBy) params.sentBy = this.sentBy;
      if (this.recipients && this.recipients.length > 0)
        params.recipients = this.recipients.join(",");
      if (this.searchKey) params.searchKey = this.searchKey;
      if (this.labels && this.labels.length > 0)
        params.labels = this.labels.join(",");
      if (this.brandIds && this.brandIds.length > 0)
        params.brandIds = this.brandIds.join(",");
      return params;
    },
  },
  hooks: {
    async deploy() {
      const params = this.buildQueryParams();
      const documents = await this.boldsign.listDocuments(params);
      for (const document of documents.result) {
        this.$emit(document, {
          id: document.documentId,
          summary: `New Document Sent: ${document.messageTitle || document.title}`,
          ts: document.activityDate * 1000,
        });
        if (document.activityDate > this.getLastTimestamp()) {
          this.setLastTimestamp(document.activityDate);
        }
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
    const lastTimestamp = this.getLastTimestamp();
    const params = {
      ...this.buildQueryParams(),
      from_ts: lastTimestamp + 1,
    };
    const documents = await this.boldsign.listDocuments(params);
    let newLastTimestamp = lastTimestamp;
    for (const document of documents.result) {
      if (document.activityDate > lastTimestamp) {
        this.$emit(document, {
          id: document.documentId,
          summary: `New Document Sent: ${document.messageTitle || document.title}`,
          ts: document.activityDate * 1000,
        });
        if (document.activityDate > newLastTimestamp) {
          newLastTimestamp = document.activityDate;
        }
      }
    }
    if (newLastTimestamp > lastTimestamp) {
      this.setLastTimestamp(newLastTimestamp);
    }
  },
};
