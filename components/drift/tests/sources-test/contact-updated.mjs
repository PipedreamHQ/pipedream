export default {
  key: "drift-contact-updated",
  name: "Contact Updated (Instant)",
  description: "Emit an event when a contact is updated in Drift.",
  version: "0.0.1",
  type: "source",
  props: {
    http: "$.interface.http",
  },
  async run(event) {
    console.log("Contact updated webhook payload:", event.body);
    this.$emit(event.body, {
      summary: `Contact updated: ${event.body.data?.attributes?.email || "Unknown email"}`,
      id: event.body.data?.id,
      ts: Date.now(),
    });
  },
};
