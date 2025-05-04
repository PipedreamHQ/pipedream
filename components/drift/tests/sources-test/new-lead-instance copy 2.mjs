import drift from "../../drift.app.mjs";

export default {
  key: "drift-new-lead-instant",
  name: "New Lead (Instant)",
  description: "Emits an event when a new email is collected from a lead via webhook.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    drift,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    source: {
      type: "string",
      label: "Lead Source",
      description: "Only emit leads that have this value for `lead_create_source` (e.g. 'CHAT', 'emailCapture')",
    },
  },

  async run(event) {
    const body = event.body;

    // Safety check: Ensure it's a contact.created event
    if (body?.type !== "contact.created") {
      this.http.respond({
        status: 200,
        body: "Ignored: not contact.created",
      });
      return;
    }

    const lead = body.data;
    const leadSource = lead?.attributes?.lead_create_source;
    const email = lead?.attributes?.email;

    if (!email || leadSource !== this.source) {
      this.http.respond({
        status: 200,
        body: "Ignored: no email or source mismatch",
      });
      return;
    }

    this.$emit(lead, {
      id: lead.id,
      summary: `New lead collected: ${email}`,
      ts: lead.attributes?.createdAt || Date.now(),
    });

    this.http.respond({
      status: 200,
      body: "Lead received and emitted",
    });
  },
};
