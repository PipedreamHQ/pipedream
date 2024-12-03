import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import fs from "fs";

export default {
  dedupe: "unique",
  props: {
    db: "$.service.db",
    timer: {
      label: "Polling Interval",
      description: "Pipedream will poll the Docusign API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    status: {
      type: "string[]",
      label: "Status",
      description: "Watch for envelopes that have been updated to the selected statuses",
      options: [
        "any",
        "completed",
        "created",
        "declined",
        "deleted",
        "delivered",
        "processing",
        "sent",
        "signed",
        "timedout",
        "voided",
      ],
      default: [
        "any",
      ],
    },
    downloadEnvelopeDocuments: {
      type: "string",
      label: "Download Envelope Documents",
      description: "Download envelope documents to the `/tmp` directory",
      options: [
        {
          label: "All Documents (PDF)",
          value: "combined",
        },
        {
          label: "All Documents (Zip)",
          value: "archive",
        },
        {
          label: "Certificate (PDF)",
          value: "certificate",
        },
        {
          label: "Portfolio (PDF)",
          value: "portfolio",
        },
      ],
      optional: true,
    },
  },
  methods: {
    _getLastEvent() {
      return this.db.get("lastEvent") || this.monthAgo().toISOString();
    },
    _setLastEvent(lastEvent) {
      this.db.set("lastEvent", lastEvent);
    },
    monthAgo() {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return monthAgo;
    },
    generateMeta({
      envelopeId, emailSubject, statusChangedDateTime,
    }) {
      const ts = Date.parse(statusChangedDateTime);
      return {
        id: `${envelopeId}-${ts}`,
        summary: emailSubject,
        ts,
      };
    },
    getFilePath(envelopeId) {
      const extension = this.downloadEnvelopeDocuments === "archive"
        ? "zip"
        : "pdf";
      return `/tmp/${envelopeId}.${extension}`;
    },
    async downloadToTmp(baseUri, documentsUri, filePath) {
      const content = await this.docusign._makeRequest({
        config: {
          url: `${baseUri}${documentsUri.slice(1)}/${this.downloadEnvelopeDocuments}`,
          responseType: "arraybuffer",
        },
      });
      const rawcontent = content.toString("base64");
      const buffer = Buffer.from(rawcontent, "base64");
      fs.writeFileSync(filePath, buffer);
    },
  },
  async run(event) {
    const { timestamp: ts } = event;
    const lastEvent = this._getLastEvent();
    const baseUri = await this.docusign.getBaseUri({
      accountId: this.account,
    });
    let done = false;
    const params = {
      from_date: lastEvent,
      status: this.status.join(),
    };

    const newEnvelopes = [];

    do {
      const {
        envelopes = [],
        nextUri,
        endPosition,
      } = await this.docusign.listEnvelopes(baseUri, params);
      if (nextUri) {
        params.start_position += endPosition + 1;
      }
      else done = true;
      newEnvelopes.push(...envelopes);
    } while (!done);

    this._setLastEvent(new Date(ts * 1000).toISOString());

    for (const envelope of newEnvelopes) {
      if (this.downloadEnvelopeDocuments) {
        const filePath = this.getFilePath(envelope.envelopeId);
        await this.downloadToTmp(baseUri, envelope.documentsUri, filePath);
        envelope.documents = {
          filePath,
        };
      }
      console.log(fs.readdirSync("/tmp"));
      const meta = this.generateMeta(envelope);
      this.$emit(envelope, meta);
    }
  },
};
