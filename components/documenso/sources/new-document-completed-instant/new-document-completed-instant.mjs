import documenso from "../../documenso.app.mjs";

export default {
  key: "documenso-new-document-completed-instant",
  name: "New Document Completed Instant",
  description: "Emit new event when a document is signed by all recipients. [See the documentation](https://docs.documenso.com/developers)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    documenso,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      // No webhook subscription activation needed as per provided requirements
    },
    async deactivate() {
      // No webhook subscription deactivation needed as per provided requirements
    },
  },
  async run(event) {
    if (event.method !== "POST") {
      return;
    }

    const {
      body, headers,
    } = event;

    // Check if the incoming POST request is a Document Signed event
    if (body?.event_type === "document.signed" && body?.data?.status === "signed") {
      this.$emit(body, {
        id: body.data.id,
        summary: `Document ID: ${body.data.id} signed by all recipients`,
        ts: Date.now(),
      });
    } else {
      this.http.respond({
        status: 200,
      });
    }
  },
};
