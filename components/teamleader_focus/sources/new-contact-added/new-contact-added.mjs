import common from "../common/common.mjs";

export default {
  ...common,
  key: "teamleader_focus-new-contact-added",
  name: "New Contact Added (Instant)",
  description: "Emit new event for each contact added. [See the documentation](https://developer.focus.teamleader.eu/docs/api/webhooks-register)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getHistoricalEvents() {
      const { data } = await this.teamleaderFocus.listContacts({
        data: {
          sort: [
            {
              field: "added_at",
              order: "desc",
            },
          ],
        },
      });
      return data;
    },
    getEventTypes() {
      return [
        "contact.added",
      ];
    },
    async getResource(body) {
      const contactId = body.subject.id;
      const { data } = await this.teamleaderFocus.getContact({
        data: {
          id: contactId,
        },
      });
      return data;
    },
    generateMeta(contact) {
      return {
        id: contact.id,
        summary: `${contact.first_name || ""} ${contact.last_name || ""}`.trim(),
        ts: Date.parse(contact.added_at),
      };
    },
  },
};
