import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Contact Created (Instant)",
  version: "0.0.1",
  key: "zoho_bigin-new-contact-created",
  description: "Emit new event on each created contact.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookEventTypes() {
      return [
        "Contacts.create",
      ];
    },
    async deploy() {
      const { data: calls } = await this.app.getContacts({
        params: {
          per_page: 10,
        },
      });

      await Promise.all(calls.map(this.emitEvent));
    },
    async emitEvent(data) {
      const { data: contacts } = await this.app.getContact({
        contactId: data?.id ?? data?.ids[0],
      });

      const contact = contacts[0];

      await this.$emit(contact, {
        id: contact.id,
        summary: `New contact created with ID ${contact.id}`,
        ts: Date.parse(contact.Created_Time),
      });
    },
  },
};
