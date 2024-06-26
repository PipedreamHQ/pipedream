import documentpro from "../../documentpro.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "documentpro-new-document-updated-instant",
  name: "New Document Updated (Instant)",
  description: "Emit new event when a file request status changes. You can only create one webhook in a parser at a time.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    documentpro,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    parserId: {
      propDefinition: [
        documentpro,
        "parserId",
      ],
    },
  },
  hooks: {
    async activate() {
      await this.documentpro.updateParser({
        parserId: this.parserId,
        data: {
          webhook_url: this.http.endpoint,
        },
      });
    },
    async deactivate() {
      await this.documentpro.updateParser({
        parserId: this.parserId,
        data: {
          webhook_url: null,
        },
      });
    },
  },
  async run({ body }) {
    this.$emit(body, {
      id: `${body.data.request_id}-${body.timestamp}`,
      summary: `New document (${body.data.response_body.file_name}) status updated: ${body.event} - ${body.data.request_status}`,
      ts: Date.parse(body.timestamp),
    });

    this.http.respond({
      status: 200,
      body: {
        message: "Received",
      },
    });
  },
  sampleEmit,
};
